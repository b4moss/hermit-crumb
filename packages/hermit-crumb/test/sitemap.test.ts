import { describe, expect, it, vi } from "vitest";

vi.mock("~/config/docsNav", () => ({
  docsNavItems: [
    { path: "/", labelKey: "home" },
    { path: "/guide", labelKey: "guide" },
  ],
}));

import {
  buildSitemapXml,
  sitemapLocales,
} from "../src/runtime/utils/buildSitemap";

describe("buildSitemapXml", () => {
  it("builds urlset with locales, alternates, and x-default", () => {
    expect(sitemapLocales).toEqual(["ja", "en"]);
    const xml = buildSitemapXml("https://ex.com/", "ja");
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("urlset");
    expect(xml).toContain("<loc>https://ex.com/ja</loc>");
    expect(xml).toContain("<loc>https://ex.com/ja/guide</loc>");
    expect(xml).toContain('hreflang="en"');
    expect(xml).toContain('hreflang="x-default"');
  });

  it("honors default locale and empty siteUrl fallback", () => {
    const xml = buildSitemapXml("", "en");
    expect(xml).toContain("<loc>https://example.com/en</loc>");
    expect(xml).toContain('hreflang="x-default" href="https://example.com/en"');
  });

  it("escapes XML special characters", async () => {
    vi.resetModules();
    vi.doMock("~/config/docsNav", () => ({
      docsNavItems: [{ path: "/a&b/<c>", labelKey: "x" }],
    }));
    const mod = await import("../src/runtime/utils/buildSitemap");
    const xml = mod.buildSitemapXml("https://ex.com");
    expect(xml).toContain("&amp;");
    expect(xml).toContain("&lt;");
    expect(xml).toContain("&gt;");
  });
});
