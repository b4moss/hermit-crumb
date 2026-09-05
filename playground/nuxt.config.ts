import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { normalizeSiteMeta, type SiteMeta } from "./app/utils/siteMeta";

function loadSiteMeta(rootDir: string): SiteMeta {
  const candidates = [
    join(rootDir, "site.meta.yaml"),
    join(rootDir, "site.meta.yaml.example"),
  ];
  for (const path of candidates) {
    if (!existsSync(path)) continue;
    try {
      const raw = parseYaml(readFileSync(path, "utf8")) as Record<
        string,
        unknown
      > | null;
      return normalizeSiteMeta(raw || undefined);
    } catch (error) {
      console.warn(`[doc-site] Failed to parse ${path}:`, error);
    }
  }
  return normalizeSiteMeta(undefined);
}

const siteMeta = loadSiteMeta(process.cwd());

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/content",
    "@nuxtjs/i18n",
    "@nuxtjs/color-mode",
    "@nuxt/scripts",
  ],
  devtools: { enabled: true },
  compatibilityDate: "2024-04-03",
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
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
  },
  // GTM: set NUXT_PUBLIC_SCRIPTS_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX (build-time for SSG).
  // Empty / unset → tagging stays disabled (see plugins/google-tag-manager.client.ts).
  scripts: {
    registry: {
      googleTagManager: {
        bundle: false,
      },
    },
  },
  colorMode: {
    preference: "system",
    fallback: "light",
    classSuffix: "",
  },
  content: {
    // Avoid better-sqlite3 native bindings on Netlify CI (Node 22+)
    experimental: { sqliteConnector: "native" },
    build: {
      markdown: {
        // Always-dark code blocks (incl. light UI). High-contrast tokens so no
        // near-black github-light colors remain on the dark pre background.
        highlight: {
          theme: "github-dark-high-contrast",
        },
      },
    },
  },
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
        },
      ],
    },
  },
  i18n: {
    // Absolute URLs for canonical / hreflang come from site.meta.yaml.
    baseUrl: siteMeta.siteUrl,
    locales: [
      { code: "ja", name: "日本語", language: "ja-JP", file: "ja.ts" },
      { code: "en", name: "English", language: "en-US", file: "en.ts" },
    ],
    defaultLocale: "ja",
    strategy: "prefix",
    lazy: true,
    langDir: "locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      fallbackLocale: "ja",
    },
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
  // public/index.html would shadow `/` in `nuxt dev` and block Nitro middleware.
  // Copy the static locale redirect page into the generate output instead.
  hooks: {
    "nitro:build:public-assets"(nitro) {
      copyFileSync(
        join(nitro.options.rootDir, "locale-root.html"),
        join(nitro.options.output.publicDir, "index.html"),
      );
    },
  },
  nitro: {
    preset: "static",
    prerender: {
      crawlLinks: true,
      routes: [
        "/ja",
        "/en",
        "/ja/getting-started",
        "/en/getting-started",
        "/ja/overview",
        "/en/overview",
        "/ja/install",
        "/en/install",
        "/ja/api",
        "/en/api",
        "/ja/tutorial",
        "/en/tutorial",
        "/ja/faq",
        "/en/faq",
        "/sitemap.xml",
        "/robots.txt",
        "/ja/syntax-contrast",
        "/en/syntax-contrast",
      ],
    },
  },
});
