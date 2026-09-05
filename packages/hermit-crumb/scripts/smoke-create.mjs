#!/usr/bin/env node
/**
 * Phase 4B smoke: create → rewrite dep to file: → npm install → nuxt prepare
 * (公開前でもモノレポ内のパッケージ実体で検証する)
 */
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { createProject } from "../src/cli/create.mjs";

const packageRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const hermitName = JSON.parse(
  await readFile(join(packageRoot, "package.json"), "utf8"),
).name;

/**
 * @param {string} command
 * @param {string[]} args
 * @param {string} cwd
 */
function run(command, args, cwd) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      env: process.env,
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${command} ${args.join(" ")} exited ${code}`));
    });
  });
}

const root = await mkdtemp(join(tmpdir(), "hermit-crumb-smoke-"));
const targetDir = join(root, "smoke-docs");

try {
  console.log(`create → ${targetDir}`);
  await createProject({ targetDir, force: false });

  const pkgPath = join(targetDir, "package.json");
  const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
  pkg.dependencies[hermitName] = `file:${packageRoot}`;
  await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");

  console.log(`npm install (${hermitName} → file:${packageRoot})`);
  await run("npm", ["install"], targetDir);

  console.log("nuxt prepare");
  await run("npx", ["nuxt", "prepare"], targetDir);

  console.log("smoke ok");
} finally {
  await rm(root, { recursive: true, force: true });
}
