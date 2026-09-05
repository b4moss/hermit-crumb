import { access, copyFile, mkdir } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ADD_TEMPLATES, findTemplate } from "./templates.mjs";

const packageRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);
const templatesDir = join(packageRoot, "templates", "add");

const NUXT_CONFIG_CANDIDATES = [
  "nuxt.config.ts",
  "nuxt.config.js",
  "nuxt.config.mjs",
  "nuxt.config.mts",
];

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
 * @param {string} cwd
 */
export async function assertNuxtApp(cwd) {
  for (const name of NUXT_CONFIG_CANDIDATES) {
    if (await pathExists(join(cwd, name))) {
      return;
    }
  }
  const err = new Error(
    `Nuxt アプリが見つかりません: ${cwd} に nuxt.config.* がありません`,
  );
  err.code = "NOT_NUXT";
  throw err;
}

/**
 * @param {{ cwd: string, name: string, force: boolean }} options
 * @returns {Promise<{ status: 'created' | 'overwritten' | 'skipped', out: string, reason?: string }>}
 */
export async function addComponent({ cwd, name, force }) {
  const template = findTemplate(name);
  if (!template) {
    const known = ADD_TEMPLATES.map((t) => t.name).join(", ");
    const err = new Error(
      `不明なコンポーネント名: ${name}\n追加可能: ${known}\n一覧: hermit-crumb add --list`,
    );
    err.code = "UNKNOWN_COMPONENT";
    throw err;
  }

  const dest = join(cwd, template.out);
  const src = join(templatesDir, template.template);
  const exists = await pathExists(dest);

  if (exists && !force) {
    return {
      status: "skipped",
      out: template.out,
      reason: "already exists (use --force to overwrite)",
    };
  }

  await mkdir(dirname(dest), { recursive: true });
  await copyFile(src, dest);

  return {
    status: exists ? "overwritten" : "created",
    out: template.out,
  };
}

export function listTemplates() {
  return ADD_TEMPLATES.map((t) => ({
    name: t.name,
    out: t.out,
    note: t.note,
  }));
}

export { templatesDir, packageRoot };
