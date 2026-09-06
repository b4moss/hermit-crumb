---
# =============================================================================
# Full-form JSON-LD sample for this page
#   @graph = WebPage + TechArticle + BreadcrumbList + SoftwareSourceCode + ItemList
# =============================================================================
title: JSON-LD
description: Authoring hermit-crumb JSON-LD (@graph) with a full frontmatter sample

jsonLd:
  webPage:
    breadcrumb:
      "@id": https://example.com/en/json-ld#breadcrumb
  entities:
    - type: TechArticle
      datePublished: "2026-01-01"
      dateModified: "2026-09-06"
      proficiencyLevel: Beginner
      author:
        "@type": Organization
        name: Bicycle for Mind LLC.
    - type: BreadcrumbList
      "@id": https://example.com/en/json-ld#breadcrumb
      itemListElement:
        - "@type": ListItem
          position: 1
          name: Home
          item: https://example.com/en
        - "@type": ListItem
          position: 2
          name: JSON-LD
          item: https://example.com/en/json-ld
  extra:
    - "@type": ItemList
      "@id": https://example.com/en/json-ld#checklist
      name: JSON-LD checklist
      itemListElement:
        - "@type": ListItem
          position: 1
          name: software in site.meta.yaml
        - "@type": ListItem
          position: 2
          name: schemaRole or jsonLd.entities
---

# JSON-LD

Each page gets one `@graph` JSON-LD block in `<head>`. This page is also a **full-form (`jsonLd`) implementation sample**. For the short form, see `schemaRole` on other pages.

## Principles

1. **One page ≠ one schema.** The page entity is always `WebPage`. Roles (`TechArticle`, …) are extra entities linked by `@id`.
2. **Conventions fill boilerplate; you write context.** `@id` / `isPartOf` are automatic. Write `datePublished` and similar yourself.

## Where to write what

| Want | Write in |
| --- | --- |
| `WebSite`, `SoftwareSourceCode` (site-wide) | `site.meta.yaml` |
| `Organization` (site-wide) | `site.meta.yaml` → `organization` |
| Non-standard entities (site-wide) | `site.meta.yaml` → `jsonLdExtra` |
| `WebPage` basics | `title` / `description` |
| Role entities | `schemaRole` or `jsonLd.entities` |
| Extra `WebPage` properties | `jsonLd.webPage` |
| Non-standard (this page only) | `jsonLd.extra` |
| FAQ Q/A | Body `::faq-list` / `::faq-item` |

Two use cases:

- **(i) Add properties to standard entities** → `jsonLd.webPage` / `jsonLd.entities`
- **(ii) Add entities outside the standard set** → `jsonLdExtra` / `jsonLd.extra`

## Short form (`schemaRole`)

```yaml
---
title: Getting started
description: Shortest path to a hermit-crumb documentation site
schemaRole: TechArticle
---
```

Emits `WebPage` + `WebSite` + `SoftwareSourceCode` + `TechArticle`.

Allowed values: `TechArticle` / `HowTo` / `FAQPage`.

## Full form (this page’s frontmatter)

Use `jsonLd` to add properties or multiple entities. The YAML at the top of this file is the worked example.

- `jsonLd.webPage` — properties on `WebPage`
- `jsonLd.entities` — role entity array (`type` is reserved; other keys are schema.org properties)
- `jsonLd.extra` — escape hatch with no defaults (write `@type` / `@id` yourself)

### Known vs unknown types

- **Known** (`TechArticle` / `HowTo` / `FAQPage`): convention defaults, then merge
- **Unknown** (e.g. `BreadcrumbList`): only `@type` and `@id` are automatic

### Auto-generated (omit these)

- `WebPage`: `@id` / `url` / `name`←`title` / `inLanguage` / `isPartOf`→`WebSite` / `about`→`SoftwareSourceCode`
- `TechArticle`: `@id`=`{URL}#article` / `headline`←`title` / `isPartOf` / `about`
- `HowTo`: `@id`=`{URL}#howto` / `name`←`title` / `isPartOf` / `about`
- `FAQPage`: `@id`=`{URL}#faq` / `mainEntity`←body `::faq-item`

### Override rules

- One-level merge; user keys win
- Changing `WebPage.@id` updates role `isPartOf`
- Frontmatter `FAQPage.mainEntity` beats body collection
- **When `jsonLd.entities` is set, `schemaRole` is ignored** (build warning). Use one or the other.

## Organization (site-wide)

```yaml
organization:
  name: Example Inc.
  url: https://example.com/
  logo: https://example.com/logo.png
  sameAs:
    - https://github.com/example
```

If omitted, neither Organization nor publisher is emitted.

## FAQ Q/A

Do not put Q/A in frontmatter. In the body:

```md
::faq-list
:::faq-item{question="Question text"}
Answer (Markdown OK)
:::
::
```

See [FAQ](./faq.md).

## Dates

Always quote: `datePublished: "2026-01-01"` (unquoted becomes a YAML Date).

## Sample page map

| File | Pattern |
| --- | --- |
| `index.md` | No `schemaRole` |
| `overview.md` / `install.md` / `getting-started.md` / `module.md` / `customize.md` | `schemaRole: TechArticle` |
| **This page** | `jsonLd` full form |
| `tutorial.md` | `schemaRole: HowTo` |
| `faq.md` | `schemaRole: FAQPage` + MDC |

Longer reference: bundled `docs/jsonld.md` (canonical detail in `docs/jsonld_ja.md`).
