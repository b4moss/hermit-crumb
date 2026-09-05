import {
  access,
  copyFile,
  mkdir,
  readdir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ADD_TEMPLATES } from "./templates.mjs";

const packageRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);
const createTemplatesDir = join(packageRoot, "templates", "create");
const addTemplatesDir = join(packageRoot, "templates", "add");

const TEXT_SUBSTITUTE_FILES = new Set(["package.json", "README.md"]);

/**
 * @param {string} path
 */
async function pathExists(path) {
  try {
    await access(path, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {string} dir
 */
async function isNonEmptyDir(dir) {
  if (!(await pathExists(dir))) {
    return false;
  }
  const info = await stat(dir);
  if (!info.isDirectory()) {
    const err = new Error(`既にファイルが存在します: ${dir}`);
    err.code = "TARGET_IS_FILE";
    throw err;
  }
  const entries = await readdir(dir);
  return entries.length > 0;
}

/**
 * @param {string} name
 */
export function toPackageName(name) {
  const base = basename(name.trim());
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "docs-site";
}

/**
 * @param {string} dir
 * @param {string} [prefix]
 * @returns {Promise<string[]>}
 */
async function listFilesRecursive(dir, prefix = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  /** @type {string[]} */
  const files = [];
  for (const entry of entries) {
    if (entry.name === "README.template.md") {
      continue;
    }
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(full, rel)));
    } else if (entry.isFile()) {
      files.push(rel);
    }
  }
  return files;
}

/**
 * @param {{
 *   dest: string,
 *   force: boolean,
 *   contents?: string | Buffer,
 *   srcPath?: string,
 * }} options
 * @returns {Promise<'created' | 'overwritten' | 'skipped'>}
 */
async function writeOne({ dest, force, contents, srcPath }) {
  const exists = await pathExists(dest);
  if (exists && !force) {
    return "skipped";
  }
  await mkdir(dirname(dest), { recursive: true });
  if (contents !== undefined) {
    await writeFile(dest, contents);
  } else if (srcPath) {
    await copyFile(srcPath, dest);
  } else {
    throw new Error("writeOne: contents または srcPath が必要です");
  }
  return exists ? "overwritten" : "created";
}

/**
 * @param {{
 *   targetDir: string,
 *   force?: boolean,
 *   packageName?: string,
 * }} options
 */
export async function createProject({ targetDir, force = false, packageName }) {
  const destRoot = resolve(targetDir);
  const name = packageName || toPackageName(destRoot);

  if ((await isNonEmptyDir(destRoot)) && !force) {
    const err = new Error(
      `ディレクトリが既に存在します: ${destRoot}\n空のディレクトリを指定するか、--force で上書きしてください。`,
    );
    err.code = "TARGET_EXISTS";
    throw err;
  }

  await mkdir(destRoot, { recursive: true });

  /** @type {{ created: string[], overwritten: string[], skipped: string[] }} */
  const summary = { created: [], overwritten: [], skipped: [] };

  /**
   * @param {string} rel
   * @param {'created' | 'overwritten' | 'skipped'} status
   */
  function record(rel, status) {
    summary[status].push(rel);
  }

  const templateFiles = await listFilesRecursive(createTemplatesDir);
  for (const rel of templateFiles) {
    const srcPath = join(createTemplatesDir, rel);
    const dest = join(destRoot, rel);

    if (TEXT_SUBSTITUTE_FILES.has(rel)) {
      const raw = await readFile(srcPath, "utf8");
      const contents = raw.replaceAll("__PACKAGE_NAME__", name);
      const status = await writeOne({ dest, force, contents });
      record(rel, status);
    } else {
      const status = await writeOne({ dest, force, srcPath });
      record(rel, status);
    }
  }

  for (const template of ADD_TEMPLATES) {
    const srcPath = join(addTemplatesDir, template.template);
    const dest = join(destRoot, template.out);
    const status = await writeOne({ dest, force, srcPath });
    record(template.out, status);
  }

  return {
    targetDir: destRoot,
    packageName: name,
    summary,
  };
}

export { createTemplatesDir, addTemplatesDir, packageRoot };
