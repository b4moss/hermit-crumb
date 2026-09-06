import { describe, expect, it, vi, beforeEach } from "vitest";
import { computed, effectScope, ref } from "vue";

const stateStore = new Map<string, { value: unknown }>();

function useState<T>(key: string, init: () => T) {
  if (!stateStore.has(key)) {
    stateStore.set(key, { value: init() });
  }
  return stateStore.get(key) as { value: T };
}

vi.stubGlobal("useState", useState);
vi.stubGlobal("computed", computed);
vi.stubGlobal("useI18n", () => ({
  t: (key: string) => `t:${key}`,
}));
vi.stubGlobal("useLocalePath", () => (path: string) => `/ja${path === "/" ? "" : path}`);
vi.stubGlobal("useRoute", () => ({ path: "/ja/guide" }));
vi.stubGlobal("onMounted", (fn: () => void) => fn());
vi.stubGlobal("useHead", vi.fn());
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

vi.mock("~/config/docsNav", () => ({
  docsNavItems: [
    { path: "/", labelKey: "home" },
    { path: "/guide", labelKey: "guide" },
    { path: "/api", labelKey: "api" },
  ],
  docsNavAccordion: {
    expandable: true,
    persist: true,
    defaultOpen: false,
  },
}));

describe("composables", () => {
  beforeEach(() => {
    stateStore.clear();
    const store: Record<string, string> = {};
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
    });
    vi.stubGlobal("import", { meta: { client: true } });
  });

  it("useSidebar toggles and closes", async () => {
    const { useSidebar } = await import("../src/runtime/composables/useSidebar");
    const scope = effectScope();
    scope.run(() => {
      const a = useSidebar();
      const b = useSidebar();
      expect(a.open.value).toBe(false);
      a.toggle();
      expect(a.open.value).toBe(true);
      expect(b.open.value).toBe(true);
      a.close();
      expect(a.open.value).toBe(false);
      a.close();
      expect(a.open.value).toBe(false);
    });
    scope.stop();
  });

  it("useDocsNav maps labels/to and useDocsPager resolves neighbors", async () => {
    const mod = await import("../src/runtime/composables/useDocsNav");
    const scope = effectScope();
    scope.run(() => {
      const { items } = mod.useDocsNav();
      expect(items.value).toEqual([
        expect.objectContaining({ label: "t:nav.home", to: "/ja" }),
        expect.objectContaining({ label: "t:nav.guide", to: "/ja/guide" }),
        expect.objectContaining({ label: "t:nav.api", to: "/ja/api" }),
      ]);
      const pager = mod.useDocsPager();
      expect(pager.prev.value?.to).toBe("/ja");
      expect(pager.next.value?.to).toBe("/ja/api");
    });
    scope.stop();
  });

  it("useDocsNavAccordion respects expand/persist settings", async () => {
    // Force client flag used by composable
    Object.defineProperty(import.meta, "client", { value: true, configurable: true });
    const { useDocsNavAccordion } = await import(
      "../src/runtime/composables/useDocsNavAccordion"
    );
    const scope = effectScope();
    scope.run(() => {
      const nav = useDocsNavAccordion();
      expect(nav.isOpen("guide")).toBe(false);
      nav.toggle("guide");
      expect(nav.isOpen("guide")).toBe(true);
      expect(nav.isOpen("guide")).toBe(true);
      nav.setOpen("guide", false);
      expect(nav.isOpen("guide")).toBe(false);
    });
    scope.stop();
  });
});
