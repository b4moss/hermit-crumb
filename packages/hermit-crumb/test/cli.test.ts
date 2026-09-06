import { describe, expect, it } from "vitest";
import { mkdtemp, mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseArgs } from "../src/cli/parse-args.mjs";
import { ADD_TEMPLATES, findTemplate } from "../src/cli/templates.mjs";
import { toPackageName, createProject } from "../src/cli/create.mjs";
import { addComponent, assertNuxtApp, listTemplates } from "../src/cli/add.mjs";
import { run } from "../bin/hermit-crumb.mjs";

const outs = {
  "DocsPager": "app/components/DocsPager.vue",
  "DocsJsonLd": "app/components/DocsJsonLd.vue",
  "FaqList": "app/components/content/FaqList.vue",
  "FaqItem": "app/components/content/FaqItem.vue",
  "CollapseBox": "app/components/content/CollapseBox.vue",
  "SiteHeader": "app/components/SiteHeader.vue",
  "SiteFooter": "app/components/SiteFooter.vue",
  "DocsSidebar": "app/components/DocsSidebar.vue",
  "HeaderPrefsMenu": "app/components/HeaderPrefsMenu.vue",
  "HeaderDropdown": "app/components/HeaderDropdown.vue"
} as const;

async function tempDir(prefix: string) {
  return mkdtemp(join(tmpdir(), prefix));
}

describe("parseArgs", () => {
  it("parses positionals and flags", () => {
    expect(parseArgs(["create", "app", "--force", "--cwd", "/tmp"])).toEqual({
      _: ["create", "app"],
      force: true,
      list: false,
      help: false,
      cwd: "/tmp",
    });
    expect(parseArgs(["add", "--list"]).list).toBe(true);
    expect(parseArgs(["--help"]).help).toBe(true);
    expect(parseArgs(["-h"]).help).toBe(true);
    expect(parseArgs(["--cwd=/var"]).cwd).toBe("/var");
    expect(parseArgs([]).cwd).toBe(process.cwd());
  });

  it("throws on missing cwd value and unknown options", () => {
    expect(() => parseArgs(["--cwd"])).toThrow(/--cwd/);
    expect(() => parseArgs(["--nope"])).toThrow(/不明なオプション/);
  });
});

describe("toPackageName / templates", () => {
  it("slugifies names and falls back", () => {
    expect(toPackageName("My Docs")).toBe("my-docs");
    expect(toPackageName("/tmp/Foo_Bar")).toBe("foo_bar");
    expect(toPackageName("!!!")).toBe("docs-site");
  });

  it("lists planned templates and finds case-insensitively", () => {
    const names = ADD_TEMPLATES.map((t) => t.name);
    for (const expected of Object.keys(outs)) {
      expect(names).toContain(expected);
    }
    expect(findTemplate("docspager")?.out).toBe(outs.DocsPager);
    expect(findTemplate("FaqList")?.out).toBe(outs.FaqList);
    expect(findTemplate("nope")).toBeNull();
    expect(findTemplate("")).toBeNull();
    expect(listTemplates()[0]).toHaveProperty("name");
  });
});

describe("createProject", () => {
  it("scaffolds a project and substitutes package name", async () => {
    const root = await tempDir("hc-create-");
    const targetDir = join(root, "acme-docs");
    const result = await createProject({ targetDir, force: false });
    expect(result.packageName).toBe("acme-docs");
    expect(result.summary.created.length).toBeGreaterThan(20);
    const pkg = JSON.parse(await readFile(join(targetDir, "package.json"), "utf8"));
    expect(pkg.name).toBe("acme-docs");
    await expect(readFile(join(targetDir, outs.DocsPager), "utf8")).resolves.toMatch(/./);
  });

  it("refuses non-empty targets without force and overwrites with force", async () => {
    const root = await tempDir("hc-create-exist-");
    const targetDir = join(root, "existing");
    await mkdir(targetDir);
    await writeFile(join(targetDir, "keep.txt"), "x\n", "utf8");
    await expect(createProject({ targetDir, force: false })).rejects.toMatchObject({
      code: "TARGET_EXISTS",
    });
    expect(await readdir(targetDir)).toEqual(["keep.txt"]);

    const target2 = join(root, "retry");
    await createProject({ targetDir: target2, force: false });
    await writeFile(join(target2, outs.SiteHeader), "<!-- local -->\n", "utf8");
    const forced = await createProject({ targetDir: target2, force: true });
    expect(forced.summary.overwritten.length).toBeGreaterThan(0);
    const header = await readFile(join(target2, outs.SiteHeader), "utf8");
    expect(header).not.toContain("<!-- local -->");
  });

  it("rejects file targets", async () => {
    const root = await tempDir("hc-create-file-");
    const file = join(root, "as-file");
    await writeFile(file, "x\n", "utf8");
    await expect(createProject({ targetDir: file, force: true })).rejects.toMatchObject({
      code: "TARGET_IS_FILE",
    });
  });
});

describe("addComponent / assertNuxtApp / run", () => {
  async function nuxtFixture() {
    const dir = await tempDir("hc-add-");
    await writeFile(join(dir, "nuxt.config.ts"), "export default {}\n", "utf8");
    return dir;
  }

  it("creates, skips, and force-overwrites components", async () => {
    const cwd = await nuxtFixture();
    await assertNuxtApp(cwd);
    const first = await addComponent({ cwd, name: "DocsPager", force: false });
    expect(first).toMatchObject({ status: "created", out: outs.DocsPager });
    const path = join(cwd, first.out);
    await writeFile(path, "/* local */\n", "utf8");
    const second = await addComponent({ cwd, name: "DocsPager", force: false });
    expect(second.status).toBe("skipped");
    expect(await readFile(path, "utf8")).toBe("/* local */\n");
    const third = await addComponent({ cwd, name: "DocsPager", force: true });
    expect(third.status).toBe("overwritten");
    expect(await readFile(path, "utf8")).not.toBe("/* local */\n");
  });

  it("writes nested content components and validates errors", async () => {
    const cwd = await nuxtFixture();
    const result = await addComponent({ cwd, name: "CollapseBox", force: false });
    expect(result.out).toBe(outs["CollapseBox" as keyof typeof outs]);
    await expect(addComponent({ cwd, name: "Nope", force: false })).rejects.toMatchObject({
      code: "UNKNOWN_COMPONENT",
    });
    const bare = await tempDir("hc-not-nuxt-");
    await mkdir(join(bare, "app"), { recursive: true });
    await expect(assertNuxtApp(bare)).rejects.toMatchObject({ code: "NOT_NUXT" });
  });

  it("run() returns expected exit codes", async () => {
    expect(await run(["--help"])).toBe(0);
    expect(await run(["create"])).toBe(1);
    expect(await run(["add", "--list"])).toBe(0);
    const cwd = await nuxtFixture();
    expect(await run(["add", "DocsJsonLd", "--cwd", cwd])).toBe(0);
    expect(await run(["add", "DocsJsonLd", "--cwd", cwd])).toBe(0);
    expect(await run(["add", "DocsJsonLd", "--cwd", cwd, "--force"])).toBe(0);
    const root = await tempDir("hc-run-create-");
    const target = join(root, "cli-demo");
    expect(await run(["create", target])).toBe(0);
    expect(await run(["create", target])).toBe(1);
    expect(await run(["create", target, "--force"])).toBe(0);
    expect(await run(["--nope"])).toBe(1);
  });
});
