import { describe, expect, it, vi } from "vitest";
import {
  normalizeJsonLdValue,
  buildJsonLdEntity,
  buildWebPage,
  sanitizeExtraEntities,
  buildOrganization,
  resolveEntityInputs,
  includesEntityType,
} from "../src/runtime/utils/jsonLdEntities";

const baseCtx = {
  pageUrl: "https://ex.com/ja/page",
  siteUrl: "https://ex.com",
  title: "Title",
  description: "Desc",
  inLanguage: "ja",
  organizationId: "https://ex.com/#organization",
  faqMainEntity: [{ "@type": "Question", name: "Q?" }],
};

describe("normalizeJsonLdValue", () => {
  it("normalizes midnight UTC dates to date-only and keeps timed dates", () => {
    expect(normalizeJsonLdValue(new Date("2026-01-01T00:00:00.000Z"))).toBe("2026-01-01");
    expect(normalizeJsonLdValue(new Date("2026-01-01T12:30:00.000Z"))).toBe("2026-01-01T12:30:00.000Z");
  });

  it("recurses arrays/objects and passes through primitives/nullish", () => {
    expect(normalizeJsonLdValue({
      n: 1,
      s: "x",
      b: true,
      d: new Date("2026-02-02T00:00:00.000Z"),
      arr: [new Date("2026-03-03T00:00:00.000Z")],
    })).toEqual({ n: 1, s: "x", b: true, d: "2026-02-02", arr: ["2026-03-03"] });
    expect(normalizeJsonLdValue(null)).toBeNull();
    expect(normalizeJsonLdValue(undefined)).toBeUndefined();
  });
});

describe("buildJsonLdEntity", () => {
  it("builds TechArticle / HowTo / FAQPage and unknown scaffolds", () => {
    const article = buildJsonLdEntity({ type: "TechArticle" }, baseCtx);
    expect(article).toMatchObject({
      "@type": "TechArticle",
      "@id": "https://ex.com/ja/page#article",
      headline: "Title",
      publisher: { "@id": baseCtx.organizationId },
    });

    const howto = buildJsonLdEntity({ type: "HowTo", name: "Custom" }, baseCtx);
    expect(howto).toMatchObject({
      "@type": "HowTo",
      "@id": "https://ex.com/ja/page#howto",
      name: "Custom",
    });

    const faq = buildJsonLdEntity({ type: "FAQPage" }, baseCtx);
    expect(faq?.mainEntity).toEqual(baseCtx.faqMainEntity);

    const unknown = buildJsonLdEntity({ type: "VideoObject" }, baseCtx);
    expect(unknown).toEqual({
      "@type": "VideoObject",
      "@id": "https://ex.com/ja/page#video-object",
    });
  });

  it("returns null for empty type or FAQPage without mainEntity", () => {
    expect(buildJsonLdEntity({ type: "  " }, baseCtx)).toBeNull();
    expect(buildJsonLdEntity({ type: "" }, baseCtx)).toBeNull();
    expect(buildJsonLdEntity({ type: "FAQPage" }, { ...baseCtx, faqMainEntity: [] })).toBeNull();
  });
});

describe("web page / organization / sanitize / resolve", () => {
  it("builds WebPage with authored overrides", () => {
    const page = buildWebPage(baseCtx, { description: "Override" });
    expect(page).toMatchObject({
      "@type": "WebPage",
      "@id": baseCtx.pageUrl,
      description: "Override",
      publisher: { "@id": baseCtx.organizationId },
    });
    expect(buildWebPage({ pageUrl: "https://ex.com/p", siteUrl: "https://ex.com", title: "T" })).toMatchObject({
      "@type": "WebPage",
      name: "T",
    });
  });

  it("builds organization only for non-empty authored objects", () => {
    expect(buildOrganization(null, "https://ex.com", "N")).toBeNull();
    expect(buildOrganization({}, "https://ex.com", "N")).toBeNull();
    expect(buildOrganization({ logo: "L" }, "https://ex.com", "N")).toMatchObject({
      "@type": "Organization",
      "@id": "https://ex.com/#organization",
      name: "N",
      logo: "L",
    });
  });

  it("sanitizes extra entities", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(sanitizeExtraEntities(null, "src")).toEqual([]);
    expect(sanitizeExtraEntities("nope", "src")).toEqual([]);
    expect(sanitizeExtraEntities([{ a: 1 }, null, [1]], "src")).toEqual([{ a: 1 }]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("resolves entity inputs with entities winning over schemaRole", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(resolveEntityInputs("HowTo", { entities: [{ type: "TechArticle" }] })).toEqual([{ type: "TechArticle" }]);
    expect(warn).toHaveBeenCalled();
    expect(resolveEntityInputs("HowTo")).toEqual([{ type: "HowTo" }]);
    expect(resolveEntityInputs(undefined)).toEqual([]);
    expect(includesEntityType("TechArticle", "HowTo", { entities: [{ type: "TechArticle" }] })).toBe(true);
    expect(includesEntityType("HowTo", "HowTo")).toBe(true);
    expect(includesEntityType("HowTo", "TechArticle")).toBe(false);
    warn.mockRestore();
  });
});
