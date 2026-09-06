---
# @graph: WebPage + WebSite + TechArticle + SoftwareSourceCode
title: Module
description: hermitCrumb options and runtime (composables / utils)
schemaRole: TechArticle
---

# Module

Entry: `@b4moss/hermit-crumb` (`packages/hermit-crumb/src/module.ts`). The public surface is the **Nuxt module** only. Prefer auto-imported composables/utils; do not deep-import package internals.

## Options (`hermitCrumb`)

```ts
export default defineNuxtConfig({
  modules: ["@b4moss/hermit-crumb"],
  hermitCrumb: {
    installDeps: true,  // install Content / i18n / color-mode / scripts
    injectStyles: true, // inject Pico.css + tokens.css
  },
})
```

| Option | Default | Behavior |
| --- | --- | --- |
| `installDeps` | `true` | `installModule` for peer modules |
| `injectStyles` | `true` | Prepend Pico and `runtime/styles/tokens.css` to `css` |

## What the module does

1. Loads `site.meta.yaml` and merges into `runtimeConfig.public` (**consumer values win**)
2. Sets `i18n.baseUrl` from `siteUrl` when unset
3. Aligns `@nuxtjs/color-mode` with Pico (`dataValue: "theme"`, etc.; consumer overrides merge in)
4. Optionally installs peers and injects styles
5. Registers auto-imports from `runtime/composables` and `runtime/utils`

## Runtime (auto-import)

Composables:

| Name | Role |
| --- | --- |
| `useDocsNav` / `useDocsPager` | Nav items and prev/next from `~/config/docsNav` |
| `useDocsNavAccordion` | Accordion open state (localStorage) |
| `useJsonLd` | JSON-LD `@graph` for pages |
| `useSidebar` | Mobile sidebar open state |

Utils (also on server):

| Name | Role |
| --- | --- |
| `normalizeSiteMeta` and related | Site meta normalization |
| Sitemap helpers | Path building |
| `extractFaq` | FAQ Q/A extraction for JSON-LD |
| `jsonLdEntities` builders | WebPage / Organization / software nodes |

## `runtimeConfig.public` fields from site meta

`siteName`, `siteUrl`, `siteVersion`, `description`, `githubUrl`, `npmUrl`, `footerText`, `software`, `organization`, `jsonLdExtra`.

Field details: [Overrides](./customize.md). JSON-LD authoring: [JSON-LD](./json-ld.md).
