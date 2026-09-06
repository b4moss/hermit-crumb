import { describe, expect, it, vi, beforeEach } from "vitest";
import { computed, effectScope, ref, toValue } from "vue";

vi.stubGlobal("computed", computed);
vi.stubGlobal("toValue", toValue);
vi.stubGlobal("useHead", vi.fn());
vi.stubGlobal("useI18n", () => ({
  locale: ref("ja"),
  locales: ref([
    { code: "ja", language: "ja-JP" },
    { code: "en", language: "en-US" },
  ]),
}));
vi.stubGlobal("useRuntimeConfig", () => ({
  public: {
    siteName: "Doc Site",
    siteUrl: "https://ex.com/",
    description: "desc",
    software: {
      name: "Doc Site",
      codeRepository: "https://github.com/x/y",
      license: "MIT",
      programmingLanguage: ["TypeScript"],
    },
    organization: { logo: "L" },
    jsonLdExtra: [{ "@type": "WebSite", name: "Extra" }],
  },
}));

describe("useJsonLd", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("builds a graph with WebPage/WebSite/software and FAQ role", async () => {
    const { useJsonLd } = await import("../src/runtime/composables/useJsonLd");
    const scope = effectScope();
    let graph: { value: { "@graph": Array<Record<string, unknown>> } } | undefined;
    scope.run(() => {
      const result = useJsonLd({
        pageUrl: "https://ex.com/ja/faq",
        title: "FAQ",
        description: "page desc",
        schemaRole: "FAQPage",
        faqItems: [
          { id: "1", question: "Q1", answer: "A1" },
          { id: "2", question: "Q1", answer: "dup" },
          { id: "3", question: "", answer: "x" },
        ],
      });
      graph = result.graph as typeof graph;
    });
    const types = graph!.value["@graph"].map((n) => n["@type"]);
    expect(types).toEqual(
      expect.arrayContaining([
        "WebPage",
        "WebSite",
        "SoftwareSourceCode",
        "Organization",
        "FAQPage",
      ]),
    );
    const faq = graph!.value["@graph"].find((n) => n["@type"] === "FAQPage");
    expect(faq?.mainEntity).toHaveLength(1);
    expect(vi.mocked(useHead)).toHaveBeenCalled();
    scope.stop();
  });
});
