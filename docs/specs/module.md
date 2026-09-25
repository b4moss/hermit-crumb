# Module

Package entry: `@b4moss/hermit-crumb` → `packages/hermit-crumb/src/module.ts`.

Public surface is the **Nuxt module** only. Prefer auto-imported composables/utils; do not deep-import package internals.

## Options (`hermitCrumb`)

```ts
export default defineNuxtConfig({
  modules: ["@b4moss/hermit-crumb"],
  hermitCrumb: {
    installDeps: true,  // default: install Content, i18n, color-mode, scripts
    injectStyles: true, // default: inject Pico.css + tokens.css
  },
})
```

| Option | Default | Behavior |
| --- | --- | --- |
| `installDeps` | `true` | `installModule` for `@nuxt/content`, `@nuxtjs/i18n`, `@nuxtjs/color-mode`, `@nuxt/scripts` |
| `injectStyles` | `true` | Prepend Pico CSS and `runtime/styles/tokens.css` to `nuxt.options.css` |

Nuxt compatibility: `>=4.5.0`.

## What the module does

1. Loads `site.meta.yaml` (see [site-meta.md](./site-meta.md)) and merges fields into `runtimeConfig.public` (consumer values win).
2. Sets `i18n.baseUrl` from `siteUrl` when unset.
3. Aligns `@nuxtjs/color-mode` with Pico (`dataValue: "theme"`, etc.; consumer overrides merge in).
4. Optionally installs peer modules and injects styles.
5. Registers auto-imports from `runtime/composables` and `runtime/utils` (client + server utils).

## Runtime (auto-import)

Composables:

| Name | Role |
| --- | --- |
| `useDocsNav` / `useDocsPager` | Nav items and prev/next from `~/config/docsNav` |
| `useDocsNavAccordion` | Accordion open state (localStorage) |
| `useJsonLd` | JSON-LD graph for pages |
| `useSidebar` | Mobile sidebar open state |

Utils (also available on server):

| Name | Role |
| --- | --- |
| `normalizeSiteMeta` / related | Site meta normalization |
| `buildSitemap` helpers | Sitemap path building |
| `extractFaq` / FAQ context | FAQ Q/A extraction for JSON-LD |
| `jsonLdEntities` builders | WebPage / Organization / software nodes |

Exact exports live under `packages/hermit-crumb/src/runtime/`.

## `runtimeConfig.public` fields from site meta

`siteName`, `siteUrl`, `siteVersion`, `description`, `githubUrl`, `npmUrl`, `footerText`, `software`, `organization`, `jsonLdExtra`.
