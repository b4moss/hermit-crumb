import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { createProject, toPackageName } from "../src/cli/create.mjs";
import { run } from "../bin/hermit-crumb.mjs";

/**
 * @returns {Promise<string>}
 */
async function tempDir() {
  return mkdtemp(join(tmpdir(), "hermit-crumb-create-"));
}

describe("toPackageName", () => {
  it("slugifies directory names", () => {
    assert.equal(toPackageName("My Docs"), "my-docs");
    assert.equal(toPackageName("/tmp/Foo_Bar"), "foo_bar");
  });
});

describe("createProject", () => {
  it("scaffolds shell, content, default UI, and page-required UI", async () => {
    const root = await tempDir();
    const targetDir = join(root, "acme-docs");

    const result = await createProject({ targetDir, force: false });
    assert.equal(result.packageName, "acme-docs");
    assert.ok(result.summary.created.length > 20);

    const pkg = JSON.parse(
      await readFile(join(targetDir, "package.json"), "utf8"),
    );
    assert.equal(pkg.name, "acme-docs");
    assert.equal(pkg.dependencies["@b4moss/hermit-crumb"], "^0.1.0");

    const nuxt = await readFile(join(targetDir, "nuxt.config.ts"), "utf8");
    assert.match(nuxt, /@b4moss\/hermit-crumb/);
    assert.doesNotMatch(nuxt, /theme-override/);

    for (const rel of [
      "site.meta.yaml.example",
      "content/ja/index.md",
      "content/en/faq.md",
      "app/config/docsNav.ts",
      "app/layouts/docs.vue",
      "app/layouts/default.vue",
      "app/components/SiteHeader.vue",
      "app/components/SiteFooter.vue",
      "app/components/DocsSidebar.vue",
      "app/components/DocsToc.vue",
      "app/components/HeaderPrefsMenu.vue",
      "app/components/HeaderDropdown.vue",
      "app/components/DocsPager.vue",
      "app/components/DocsJsonLd.vue",
      "app/components/content/FaqList.vue",
      "app/components/content/FaqItem.vue",
      "app/components/content/CollapseBox.vue",
    ]) {
      await assert.doesNotReject(() => readFile(join(targetDir, rel), "utf8"));
    }

    const docsLayout = await readFile(
      join(targetDir, "app/layouts/docs.vue"),
      "utf8",
    );
    assert.match(docsLayout, /DocsToc/);
    assert.match(docsLayout, /DocsSidebar/);
    const defaultLayout = await readFile(
      join(targetDir, "app/layouts/default.vue"),
      "utf8",
    );
    assert.doesNotMatch(defaultLayout, /DocsToc/);
    assert.doesNotMatch(defaultLayout, /DocsSidebar/);
    const slugPage = await readFile(
      join(targetDir, "app/pages/[...slug].vue"),
      "utf8",
    );
    assert.match(slugPage, /layout:\s*["']docs["']/);

    const readme = await readFile(join(targetDir, "README.md"), "utf8");
    assert.match(readme, /acme-docs/);
    assert.match(readme, /利用側所有|所有/);
  });

  it("refuses non-empty target without --force", async () => {
    const root = await tempDir();
    const targetDir = join(root, "existing");
    await mkdir(targetDir);
    await writeFile(join(targetDir, "keep.txt"), "x\n", "utf8");

    await assert.rejects(
      () => createProject({ targetDir, force: false }),
      /既に存在/,
    );
    assert.deepEqual(await readdir(targetDir), ["keep.txt"]);
  });

  it("overwrites with --force and skips without on second pass of empty merge", async () => {
    const root = await tempDir();
    const targetDir = join(root, "retry");

    await createProject({ targetDir, force: false });
    await writeFile(
      join(targetDir, "app/components/SiteHeader.vue"),
      "<!-- local -->\n",
      "utf8",
    );

    const skipped = await createProject({ targetDir, force: false }).then(
      () => {
        throw new Error("expected TARGET_EXISTS");
      },
      (err) => err,
    );
    assert.equal(skipped.code, "TARGET_EXISTS");

    const forced = await createProject({ targetDir, force: true });
    assert.ok(forced.summary.overwritten.length > 0);
    const header = await readFile(
      join(targetDir, "app/components/SiteHeader.vue"),
      "utf8",
    );
    assert.doesNotMatch(header, /<!-- local -->/);
  });
});

describe("CLI create", () => {
  it("creates via run() and fails on second call without --force", async () => {
    const root = await tempDir();
    const target = join(root, "cli-demo");

    const first = await run(["create", target]);
    assert.equal(first, 0);

    const second = await run(["create", target]);
    assert.equal(second, 1);

    const third = await run(["create", target, "--force"]);
    assert.equal(third, 0);
  });
});
