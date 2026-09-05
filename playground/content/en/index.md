---
# @graph: WebPage + WebSite + SoftwareSourceCode (no schemaRole)
# Write in: site.meta.yaml (shared) / title・description (this page)
# See: docs/jsonld.md (full: docs/jsonld_ja.md)
title: Home
description: Scaffold for a Nuxt Content documentation site
---

# Doc Site

This branch is a Nuxt Content documentation site starter.

## Next steps

1. Copy `site.meta.yaml.example` to `site.meta.yaml` and set site variables
2. Edit sidebar / pager entries in `app/config/docsNav.ts`
3. Add Markdown under `content/{ja,en}/` (set `schemaRole` when needed)
4. Keep `nav.*` labels in `i18n/locales/` in sync

## JSON-LD sample pages (#40) — what you write vs what you get

| Page | What to write | Resulting `@graph` |
| --- | --- | --- |
| This page (top) | No `schemaRole` + `site.meta.yaml` | WebPage + SoftwareSourceCode |
| [Overview](./overview.md) | `schemaRole: TechArticle` | WebPage + TechArticle + SoftwareSourceCode |
| [Install](./install.md) | `schemaRole: TechArticle` | Same |
| [API](./api.md) | `jsonLd` (full form) | WebPage + TechArticle + BreadcrumbList + … |
| [Tutorial](./tutorial.md) | `schemaRole: HowTo` | WebPage + HowTo + SoftwareSourceCode |
| [FAQ](./faq.md) | `schemaRole: FAQPage` + `::faq-item` | WebPage + FAQPage + SoftwareSourceCode |

See [Getting started](./getting-started.md) and the repo file `docs/jsonld.md` for details.
