import { beforeEach, describe, expect, it, vi } from "vitest";

const installModule = vi.fn(async () => {});
const addImportsDir = vi.fn();
const addServerImportsDir = vi.fn();
const createResolver = vi.fn(() => ({
  resolve: (p: string) => p,
}));

vi.mock("@nuxt/kit", () => ({
  defineNuxtModule: (meta: unknown) => meta,
  installModule,
  addImportsDir,
  addServerImportsDir,
  createResolver,
}));

vi.mock("../src/loadSiteMeta", () => ({
  loadSiteMeta: () => ({
    siteName: "FromMeta",
    siteUrl: "https://meta.test",
    siteVersion: "1",
    description: "d",
    githubUrl: "https://github.com/x/y",
    npmUrl: "",
    footerText: "f",
    software: {
      name: "FromMeta",
      codeRepository: "https://github.com/x/y",
      license: "MIT",
      programmingLanguage: [],
    },
    organization: null,
    jsonLdExtra: [],
  }),
}));

describe("hermit-crumb module", () => {
  beforeEach(() => {
    installModule.mockClear();
    addImportsDir.mockClear();
    addServerImportsDir.mockClear();
  });

  it("installs deps, injects styles, and merges runtime config by default", async () => {
    const mod = (await import("../src/module")).default as {
      defaults: Record<string, unknown>;
      setup: (options: Record<string, unknown>, nuxt: Record<string, unknown>) => Promise<void>;
    };
    expect(mod.defaults).toMatchObject({ installDeps: true, injectStyles: true });
    const nuxt = {
      options: {
        rootDir: "/tmp/app",
        runtimeConfig: { public: { siteName: "ConsumerWins" } },
        i18n: {},
        colorMode: { preference: "dark" },
        css: ["~/app.css"],
      },
    };
    await mod.setup({}, nuxt);
    expect(installModule).toHaveBeenCalledWith("@nuxt/content");
    expect(installModule).toHaveBeenCalledWith("@nuxtjs/i18n");
    expect(installModule).toHaveBeenCalledWith("@nuxtjs/color-mode");
    expect(installModule).toHaveBeenCalledWith("@nuxt/scripts");
    expect(nuxt.options.runtimeConfig.public.siteName).toBe("ConsumerWins");
    expect(nuxt.options.runtimeConfig.public.siteUrl).toBe("https://meta.test");
    expect(nuxt.options.i18n.baseUrl).toBe("https://meta.test");
    expect(nuxt.options.colorMode).toMatchObject({
      preference: "dark",
      dataValue: "theme",
    });
    expect(nuxt.options.css[0]).toContain("pico");
    expect(addImportsDir).toHaveBeenCalled();
    expect(addServerImportsDir).toHaveBeenCalled();
  });

  it("skips installs/styles when disabled and tolerates missing i18n", async () => {
    vi.resetModules();
    const mod = (await import("../src/module")).default as {
      setup: (options: Record<string, unknown>, nuxt: Record<string, unknown>) => Promise<void>;
    };
    const nuxt = {
      options: {
        rootDir: "/tmp/app",
        runtimeConfig: { public: {} },
        css: [],
      },
    };
    await mod.setup({ installDeps: false, injectStyles: false }, nuxt);
    expect(installModule).not.toHaveBeenCalled();
    expect(nuxt.options.css).toEqual([]);
  });
});
