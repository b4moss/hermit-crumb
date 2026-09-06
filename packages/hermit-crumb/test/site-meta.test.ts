import { describe, expect, it } from "vitest";
import { mkdtemp, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  defaultSiteMeta,
  normalizeSiteMeta,
} from "../src/runtime/utils/siteMeta";
import { loadSiteMeta } from "../src/loadSiteMeta";

describe("normalizeSiteMeta", () => {
  it("returns defaults for undefined/null", () => {
    expect(normalizeSiteMeta(undefined)).toEqual(defaultSiteMeta);
    expect(normalizeSiteMeta(null)).toEqual(defaultSiteMeta);
  });

  it("merges partial input and strips trailing slash from siteUrl", () => {
    const result = normalizeSiteMeta({
      siteName: "Acme",
      githubUrl: "https://github.com/acme/docs",
      siteUrl: "https://docs.acme.test/",
    });
    expect(result.siteName).toBe("Acme");
    expect(result.githubUrl).toBe("https://github.com/acme/docs");
    expect(result.siteUrl).toBe("https://docs.acme.test");
    expect(result.footerText).toBe(defaultSiteMeta.footerText);
    expect(result.software.name).toBe("Acme");
    expect(result.software.codeRepository).toBe("https://github.com/acme/docs");
  });

  it("keeps organization object and jsonLdExtra array", () => {
    const organization = { name: "Acme Inc" };
    const jsonLdExtra = [{ "@type": "WebSite", name: "X" }];
    const result = normalizeSiteMeta({ organization, jsonLdExtra });
    expect(result.organization).toEqual(organization);
    expect(result.jsonLdExtra).toEqual(jsonLdExtra);
  });

  it("nulls invalid organization and empties invalid jsonLdExtra/languages", () => {
    const result = normalizeSiteMeta({
      organization: ["nope"] as unknown as Record<string, unknown>,
      jsonLdExtra: "nope" as unknown as Record<string, unknown>[],
      software: { programmingLanguage: "ts" as unknown as string[] },
      siteName: "",
      npmUrl: "https://npmjs.com/package/x",
    });
    expect(result.organization).toBeNull();
    expect(result.jsonLdExtra).toEqual([]);
    expect(result.software.programmingLanguage).toEqual([]);
    expect(result.siteName).toBe(defaultSiteMeta.siteName);
    expect(result.npmUrl).toBe("https://npmjs.com/package/x");
  });

  it("defaults npmUrl to empty string when omitted", () => {
    expect(normalizeSiteMeta({ siteName: "A" }).npmUrl).toBe("");
  });
});

describe("loadSiteMeta", () => {
  it("prefers site.meta.yaml over example and package example", async () => {
    const root = await mkdtemp(join(tmpdir(), "site-meta-"));
    await writeFile(join(root, "site.meta.yaml"), "siteName: FromYaml\n", "utf8");
    await writeFile(
      join(root, "site.meta.yaml.example"),
      "siteName: FromExample\n",
      "utf8",
    );
    const pkgExample = join(root, "pkg.example.yaml");
    await writeFile(pkgExample, "siteName: FromPackage\n", "utf8");
    expect(loadSiteMeta(root, pkgExample).siteName).toBe("FromYaml");
  });

  it("falls back to example then package example then defaults", async () => {
    const root = await mkdtemp(join(tmpdir(), "site-meta-ex-"));
    await writeFile(
      join(root, "site.meta.yaml.example"),
      "siteName: FromExample\n",
      "utf8",
    );
    expect(loadSiteMeta(root).siteName).toBe("FromExample");

    const root2 = await mkdtemp(join(tmpdir(), "site-meta-pkg-"));
    const pkgExample = join(root2, "pkg.example.yaml");
    await writeFile(pkgExample, "siteName: FromPackage\n", "utf8");
    expect(loadSiteMeta(root2, pkgExample).siteName).toBe("FromPackage");

    const root3 = await mkdtemp(join(tmpdir(), "site-meta-empty-"));
    expect(loadSiteMeta(root3)).toEqual(defaultSiteMeta);
  });

  it("skips broken yaml and continues", async () => {
    const root = await mkdtemp(join(tmpdir(), "site-meta-bad-"));
    await writeFile(join(root, "site.meta.yaml"), "siteName: [broken\n", "utf8");
    await writeFile(
      join(root, "site.meta.yaml.example"),
      "siteName: Recovered\n",
      "utf8",
    );
    expect(loadSiteMeta(root).siteName).toBe("Recovered");
  });

  it("treats empty yaml as defaults and ignores missing package example", async () => {
    const root = await mkdtemp(join(tmpdir(), "site-meta-null-"));
    await writeFile(join(root, "site.meta.yaml"), "null\n", "utf8");
    expect(loadSiteMeta(root, join(root, "missing.yaml"))).toEqual(
      defaultSiteMeta,
    );
  });
});
