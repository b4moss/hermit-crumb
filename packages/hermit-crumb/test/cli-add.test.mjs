import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { addComponent, assertNuxtApp } from "../src/cli/add.mjs";
import { run } from "../bin/hermit-crumb.mjs";
import { findTemplate, ADD_TEMPLATES } from "../src/cli/templates.mjs";
import { parseArgs } from "../src/cli/parse-args.mjs";

/**
 * @returns {Promise<string>}
 */
async function makeNuxtFixture() {
  const dir = await mkdtemp(join(tmpdir(), "hermit-crumb-add-"));
  await writeFile(join(dir, "nuxt.config.ts"), "export default {}\n", "utf8");
  return dir;
}

describe("parseArgs", () => {
  it("parses force, cwd, and positional args", () => {
    const args = parseArgs([
      "add",
      "DocsPager",
      "--force",
      "--cwd",
      "/tmp/demo",
    ]);
    assert.equal(args.force, true);
    assert.equal(args.cwd, "/tmp/demo");
    assert.deepEqual(args._, ["add", "DocsPager"]);
  });
});

describe("templates registry", () => {
  it("lists planned add targets", () => {
    const names = ADD_TEMPLATES.map((t) => t.name);
    for (const expected of [
      "DocsPager",
      "DocsJsonLd",
      "FaqList",
      "FaqItem",
      "CollapseBox",
      "SiteHeader",
      "SiteFooter",
      "DocsSidebar",
      "HeaderPrefsMenu",
      "HeaderDropdown",
    ]) {
      assert.ok(names.includes(expected), `missing ${expected}`);
    }
  });

  it("maps content components under app/components/content", () => {
    const faq = findTemplate("FaqList");
    assert.ok(faq);
    assert.equal(faq.out, "app/components/content/FaqList.vue");
  });
});

describe("addComponent overwrite rules", () => {
  it("creates, skips on re-run, overwrites with --force", async () => {
    const cwd = await makeNuxtFixture();
    await assertNuxtApp(cwd);

    const first = await addComponent({
      cwd,
      name: "DocsPager",
      force: false,
    });
    assert.equal(first.status, "created");
    assert.equal(first.out, "app/components/DocsPager.vue");

    const path = join(cwd, first.out);
    const original = await readFile(path, "utf8");
    assert.match(original, /docs-pager/);

    await writeFile(path, "/* local edit */\n", "utf8");

    const second = await addComponent({
      cwd,
      name: "DocsPager",
      force: false,
    });
    assert.equal(second.status, "skipped");
    assert.match(second.reason ?? "", /already exists/);
    assert.equal(await readFile(path, "utf8"), "/* local edit */\n");

    const third = await addComponent({
      cwd,
      name: "DocsPager",
      force: true,
    });
    assert.equal(third.status, "overwritten");
    const restored = await readFile(path, "utf8");
    assert.match(restored, /docs-pager/);
    assert.notEqual(restored, "/* local edit */\n");
  });

  it("writes content components into nested paths", async () => {
    const cwd = await makeNuxtFixture();
    const result = await addComponent({
      cwd,
      name: "CollapseBox",
      force: false,
    });
    assert.equal(result.status, "created");
    assert.equal(result.out, "app/components/content/CollapseBox.vue");
    const body = await readFile(join(cwd, result.out), "utf8");
    assert.match(body, /CollapseBox|collapse/i);
  });

  it("rejects unknown component names", async () => {
    const cwd = await makeNuxtFixture();
    await assert.rejects(
      () => addComponent({ cwd, name: "NotAThing", force: false }),
      /不明なコンポーネント名/,
    );
  });

  it("requires a Nuxt app root", async () => {
    const dir = await mkdtemp(join(tmpdir(), "hermit-crumb-not-nuxt-"));
    await mkdir(join(dir, "app"), { recursive: true });
    await assert.rejects(() => assertNuxtApp(dir), /Nuxt アプリが見つかりません/);
  });
});

describe("CLI run()", () => {
  it("prints help and returns 0", async () => {
    const code = await run(["--help"]);
    assert.equal(code, 0);
  });

  it("stubs create with exit 1", async () => {
    const code = await run(["create", "my-site"]);
    assert.equal(code, 1);
  });

  it("lists templates", async () => {
    const code = await run(["add", "--list"]);
    assert.equal(code, 0);
  });

  it("adds via --cwd and skips without --force", async () => {
    const cwd = await makeNuxtFixture();
    const first = await run(["add", "DocsJsonLd", "--cwd", cwd]);
    assert.equal(first, 0);
    const second = await run(["add", "DocsJsonLd", "--cwd", cwd]);
    assert.equal(second, 0);
    const forced = await run(["add", "DocsJsonLd", "--cwd", cwd, "--force"]);
    assert.equal(forced, 0);
  });
});
