---
# @graph: WebPage + WebSite + TechArticle + SoftwareSourceCode
# Write in: site.meta.yaml (shared) / schemaRole: TechArticle / title・description
# See: docs/jsonld.md (full: docs/jsonld_ja.md)
title: Getting started
description: How to use this documentation site scaffold
schemaRole: TechArticle
---

# Getting started

## Dev server

```bash
npm install
npm run dev
```

## Static generate

```bash
npm run generate
```

Output goes to `.output/public`.

## Customization map

| Location | Purpose |
| --- | --- |
| `site.meta.yaml` (from `.example`) | Site name, URL, GitHub, **SoftwareSourceCode** |
| Each Markdown frontmatter | `title` / `description` / **`schemaRole`** or **`jsonLd`** |
| FAQ body `::faq-item` | **FAQPage** Question / Answer |
| `app/config/docsNav.ts` | Sidebar / pager |
| `i18n/locales/` | UI copy (including nav labels) |

## JSON-LD — what you write vs what you get

See the repo file `docs/jsonld.md` for the full authoring guide (Japanese canonical: `docs/jsonld_ja.md`).

| Page | What to write | Resulting `@graph` |
| --- | --- | --- |
| [Home](./index.md) | No `schemaRole` | WebPage + SoftwareSourceCode |
| [Overview](./overview.md) | `schemaRole: TechArticle` | WebPage + TechArticle + SoftwareSourceCode |
| [Install](./install.md) | Same | Same |
| [API](./api.md) | `jsonLd` (full form) | WebPage + TechArticle + BreadcrumbList + … |
| [Tutorial](./tutorial.md) | `schemaRole: HowTo` | WebPage + HowTo + SoftwareSourceCode |
| [FAQ](./faq.md) | `schemaRole: FAQPage` + `::faq-item` | WebPage + FAQPage + SoftwareSourceCode |
