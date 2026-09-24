---
# @graph: WebPage + WebSite + TechArticle + SoftwareSourceCode
title: Getting started
description: Shortest path to a hermit-crumb documentation site
schemaRole: TechArticle
---

# Getting started

The shortest path is the `create` CLI. Generated files belong to your project (package updates do not rewrite them).

## Create a site

```bash
npx @b4moss/hermit-crumb create my-docs
cd my-docs
cp site.meta.yaml.example site.meta.yaml   # optional
npm install
npm run dev
```

What `create` writes:

- `@b4moss/hermit-crumb` wired in `nuxt.config.ts`
- JA/EN usage content (this set of Markdown pages)
- UI: `SiteHeader` / `SiteFooter` / `DocsSidebar` / FAQ / pager helpers
- `app/config/docsNav.ts`, `i18n/locales/`, `site.meta.yaml.example`

| Flag | Effect |
| --- | --- |
| `--force` | Overwrite existing files in the target directory |

## Dev and static generate

```bash
npm run dev
npm run generate   # output: .output/public
```

## Customization entry points

| Location | Purpose |
| --- | --- |
| `site.meta.yaml` | Site name, URLs, GitHub / npm, **SoftwareSourceCode** |
| Markdown frontmatter | `title` / `description` / `schemaRole` or `jsonLd` |
| Body `::faq-item` | FAQPage Q/A |
| `app/config/docsNav.ts` | Sidebar / pager |
| `i18n/locales/` | UI copy (`nav.*` included) |
| CSS variable overrides | Theme (Pico tokens) |

Next: [Overview](./overview.md) for ownership, [Setup](./install.md) for `add` and module-only install.
