import {
  addImportsDir,
  addServerImportsDir,
  createResolver,
  defineNuxtModule,
  installModule,
} from "@nuxt/kit";
import { loadSiteMeta } from "./loadSiteMeta";

export interface HermitCrumbModuleOptions {
  /**
   * When true (default), install Content / i18n / color-mode / scripts.
   * Consumer nuxt.config still owns detailed module options.
   */
  installDeps?: boolean;
  /**
   * When true (default), inject Pico.css + hermit-crumb color tokens via the module.
   */
  injectStyles?: boolean;
}

export default defineNuxtModule<HermitCrumbModuleOptions>({
  meta: {
    name: "@b4moss/hermit-crumb",
    configKey: "hermitCrumb",
    compatibility: {
      nuxt: ">=4.5.0",
    },
  },
  defaults: {
    installDeps: true,
    injectStyles: true,
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const packageExample = resolver.resolve("../site.meta.yaml.example");
    const siteMeta = loadSiteMeta(nuxt.options.rootDir, packageExample);

    // Merge site meta into public runtime config (consumer overrides win).
    nuxt.options.runtimeConfig.public = {
      ...{
        siteName: siteMeta.siteName,
        siteUrl: siteMeta.siteUrl,
        siteVersion: siteMeta.siteVersion,
        description: siteMeta.description,
        githubUrl: siteMeta.githubUrl,
        npmUrl: siteMeta.npmUrl,
        footerText: siteMeta.footerText,
        software: siteMeta.software,
        organization: siteMeta.organization,
        jsonLdExtra: siteMeta.jsonLdExtra,
      },
      ...nuxt.options.runtimeConfig.public,
    };

    // Default i18n.baseUrl from site meta when the consumer has not set it.
    const i18nOptions = (nuxt.options as { i18n?: { baseUrl?: string } }).i18n;
    if (i18nOptions && !i18nOptions.baseUrl) {
      i18nOptions.baseUrl = siteMeta.siteUrl;
    }

    // Align @nuxtjs/color-mode with Pico's data-theme attribute.
    const colorMode = (nuxt.options as {
      colorMode?: Record<string, unknown>;
    }).colorMode;
    nuxt.options.colorMode = {
      preference: "system",
      fallback: "light",
      classSuffix: "",
      dataValue: "theme",
      ...colorMode,
    };

    if (options.installDeps !== false) {
      await installModule("@nuxt/content");
      await installModule("@nuxtjs/i18n");
      await installModule("@nuxtjs/color-mode");
      await installModule("@nuxt/scripts");
    }

    if (options.injectStyles !== false) {
      const picoCss = resolver.resolve(
        "../node_modules/@picocss/pico/css/pico.min.css",
      );
      // Prefer the workspace-hoisted package path when present.
      const picoCandidates = [
        "@picocss/pico/css/pico.min.css",
        picoCss,
      ];
      nuxt.options.css = [
        picoCandidates[0],
        resolver.resolve("./runtime/styles/tokens.css"),
        ...(nuxt.options.css || []),
      ];
    }

    addImportsDir(resolver.resolve("./runtime/composables"));
    addImportsDir(resolver.resolve("./runtime/utils"));
    addServerImportsDir(resolver.resolve("./runtime/utils"));
  },
});
