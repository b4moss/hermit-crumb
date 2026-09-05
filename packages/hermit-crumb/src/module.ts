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

    if (options.installDeps !== false) {
      await installModule("@nuxt/content");
      await installModule("@nuxtjs/i18n");
      await installModule("@nuxtjs/color-mode");
      await installModule("@nuxt/scripts");
    }

    addImportsDir(resolver.resolve("./runtime/composables"));
    addImportsDir(resolver.resolve("./runtime/utils"));
    addServerImportsDir(resolver.resolve("./runtime/utils"));
  },
});
