#!/usr/bin/env node
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { addComponent, assertNuxtApp, listTemplates } from "../src/cli/add.mjs";
import { HELP_TEXT } from "../src/cli/help.mjs";
import { parseArgs } from "../src/cli/parse-args.mjs";

/**
 * @param {string[]} argv
 * @returns {Promise<number>}
 */
export async function run(argv) {
  let args;
  try {
    args = parseArgs(argv);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    return 1;
  }

  const [command, ...rest] = args._;

  if (!command || command === "help" || args.help) {
    console.log(HELP_TEXT);
    return 0;
  }

  if (command === "create") {
    console.error(
      "create は未実装です。Phase 4B で実装予定です。\n詳細: docs/specs/cli/create-and-add.md",
    );
    return 1;
  }

  if (command === "add") {
    if (args.list || rest[0] === "--list") {
      const rows = listTemplates();
      console.log("追加可能なコンポーネント:\n");
      for (const row of rows) {
        const note = row.note ? `  # ${row.note}` : "";
        console.log(`  ${row.name.padEnd(18)} → ${row.out}${note}`);
      }
      console.log(
        "\n生成後は利用側所有です。パッケージ更新では自動上書きしません。",
      );
      return 0;
    }

    const name = rest[0];
    if (!name) {
      console.error("使い方: hermit-crumb add <name> [--force] [--cwd <dir>]");
      console.error("一覧: hermit-crumb add --list");
      return 1;
    }

    const cwd = resolve(args.cwd);
    try {
      await assertNuxtApp(cwd);
      const result = await addComponent({
        cwd,
        name,
        force: args.force,
      });

      if (result.status === "skipped") {
        console.log(`skip  ${result.out} — ${result.reason}`);
      } else if (result.status === "overwritten") {
        console.log(`write ${result.out} (forced)`);
      } else {
        console.log(`create ${result.out}`);
      }

      console.log(
        "\n生成ファイルは利用側所有です。以降のパッケージ更新では触れません。",
      );
      return 0;
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
      return 1;
    }
  }

  console.error(`不明なコマンド: ${command}\n`);
  console.log(HELP_TEXT);
  return 1;
}

const selfPath = fileURLToPath(import.meta.url);
const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath && resolve(invokedPath) === resolve(selfPath)) {
  process.exitCode = await run(process.argv.slice(2));
}
