---
# @graph: WebPage + WebSite + TechArticle + SoftwareSourceCode
title: Overview
description: hermit-crumb architecture, ownership, and package boundaries
schemaRole: TechArticle
---

# Overview

hermit-crumb is a documentation **shell**. Shell behavior (meta loading, peer module install, style injection, composable/utils auto-imports) lives in the package; presentation and documents live in your app.

## Pieces

| Piece | Role |
| --- | --- |
| Nuxt module `@b4moss/hermit-crumb` | Load `site.meta.yaml`, install Content / i18n / color-mode / scripts, inject Pico + tokens, auto-import runtime |
| CLI `create` | Scaffold a full docs site |
| CLI `add` | Add or restore UI components (`--force` to overwrite) |
| Runtime | Nav, sidebar, JSON-LD, FAQ extraction, sitemap, and related helpers |

## Ownership (important)

| Stays with the package | Yours after create/add |
| --- | --- |
| Nuxt module, Pico + default tokens | `app/components/**` |
| Auto-imported composables / utils | `content/**`, `app/config/docsNav.ts` |
| `site.meta.yaml` shape / example | `site.meta.yaml` values, override CSS |

Updating the package does not rewrite generated files. Use `npx @b4moss/hermit-crumb add <Name> --force` only when you want a template restored.

## Requirements

- Node.js `>= 24.20`
- Nuxt `^4.5.2` (module compatibility `>=4.5.0`)
- Peers: `@nuxt/content`, `@nuxtjs/i18n`, `@nuxtjs/color-mode`, `@nuxt/scripts` (installed when `installDeps: true`)

See [Module](./module.md) for options and [Overrides](./customize.md) for replacement paths.
