---
# @graph: WebPage + WebSite + FAQPage + SoftwareSourceCode
title: FAQ
description: hermit-crumb FAQ (MDC accordion and FAQPage JSON-LD)
schemaRole: FAQPage
---

# FAQ

Common questions. Also a sample of `schemaRole: FAQPage` plus body `::faq-item` feeding JSON-LD Q/A.

::faq-list
:::faq-item{question="Where do I put site.meta.yaml?"}
Copy `site.meta.yaml.example` to `site.meta.yaml` at the project root. If missing, resolution falls back through the example → package-bundled example → built-in defaults.
:::

:::faq-item{question="Does updating the package change my UI?"}
No. Files from `create` / `add` are yours. Restore a template only with `npx @b4moss/hermit-crumb add <Name> --force`.
:::

:::faq-item{question="Can I disable module styles?"}
Set `hermitCrumb: { injectStyles: false }` to skip Pico / token injection, then load your own styles. For color-only changes, prefer CSS variable overrides.
:::

:::faq-item{question="When is JSON-LD decided?"}
During SSR / SSG render, `useJsonLd()` builds the `@graph` and inserts it via `useHead`. See [JSON-LD](./json-ld.md).
:::

:::faq-item{question="How do I author FAQ Q/A?"}
Place `::faq-item{question="..."}` inside `::faq-list`. The answer is the slot body (Markdown OK). Items are collected into `FAQPage.mainEntity`.
:::

:::faq-item{question="Do consumers need the npm publish flow?"}
No. Depend on a published `@b4moss/hermit-crumb` version. The npm publish path (`release` + `v*` tag) is for package maintainers. Site overrides are covered in [Overrides](./customize.md).
:::
::
