---
# @graph: WebPage + WebSite + SoftwareSourceCode (no schemaRole)
# Write in: site.meta.yaml (shared) / title・description (this page)
# See: docs/jsonld.md and [JSON-LD](./json-ld.md)
title: Home
description: Nuxt v4 tech documentation site shell @b4moss/hermit-crumb
---

# hermit-crumb

`@b4moss/hermit-crumb` is a **tech documentation site shell** for Nuxt v4. It ships a Nuxt module plus CLI (`create` / `add`). Shell logic (nav helpers, i18n wiring, site meta, JSON-LD, Pico.css tokens) stays in the package; UI and content belong to you.

This playground (and the content `create` scaffolds) is both a product usage guide and a living sample of Markdown / frontmatter / MDC patterns.

## Suggested reading order

1. [Getting started](./getting-started.md) — scaffold with `create`
2. [Overview](./overview.md) — module / CLI / ownership boundaries
3. [Setup](./install.md) — `create` / `add` / module-only
4. [Module](./module.md) — `hermitCrumb` options and runtime
5. [Overrides](./customize.md) — theme, components, meta
6. [JSON-LD](./json-ld.md) — `@graph` authoring (full-form sample)
7. [Tutorial](./tutorial.md) — scaffold through publish-ready generate

## JSON-LD sample map

| Page | What you write | Resulting `@graph` (approx.) |
| --- | --- | --- |
| This page | No `schemaRole` | WebPage + WebSite + SoftwareSourceCode |
| [Overview](./overview.md) etc. | `schemaRole: TechArticle` | + TechArticle |
| [JSON-LD](./json-ld.md) | `jsonLd` (full form) | + TechArticle + BreadcrumbList + … |
| [Tutorial](./tutorial.md) | `schemaRole: HowTo` | + HowTo |
| [FAQ](./faq.md) | `schemaRole: FAQPage` + `::faq-item` | + FAQPage |
