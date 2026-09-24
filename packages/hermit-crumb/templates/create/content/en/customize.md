---
# @graph: WebPage + WebSite + TechArticle + SoftwareSourceCode
title: Overrides
description: Theme, component, and site-meta overrides — and how package updates interact
schemaRole: TechArticle
---

# Overrides

To make hermit-crumb your docs site, edit generated files, override CSS variables, and fill in `site.meta.yaml`. You do not need to fork the package.

## 1. Site meta (`site.meta.yaml`)

```bash
cp site.meta.yaml.example site.meta.yaml
```

Resolution order (first wins):

1. Project `site.meta.yaml`
2. Project `site.meta.yaml.example`
3. Package-bundled example
4. Built-in defaults (`normalizeSiteMeta`)

Main fields:

| Field | Use |
| --- | --- |
| `siteName` / `siteUrl` / `siteVersion` / `description` | Branding, URLs, fallbacks |
| `githubUrl` / `npmUrl` | Header links (`npmUrl` empty → hide) |
| `footerText` | Footer copy |
| `software` | Site-wide `SoftwareSourceCode` |
| `organization` | Optional `Organization` (publisher) |
| `jsonLdExtra` | Extra `@graph` entities on every page |

Page roles (`TechArticle`, etc.) live in Markdown. See [JSON-LD](./json-ld.md).

## 2. Theme (CSS variables)

After the module injects Pico + tokens, override variables in a **later** CSS file. Playground `app/assets/css/theme-override.css` is the sample.

Common variables:

| Variable | Purpose |
| --- | --- |
| `--pico-primary*` | Pico primary palette |
| `--color-accent*` | Shell accent |
| `--color-bg` / `--color-surface` / `--color-ink` | Surfaces / text |
| `--hc-max-width` / `--hc-header-height` / `--hc-sidebar-width` | Layout shells |

Own all styles yourself:

```ts
hermitCrumb: {
  injectStyles: false,
}
```

## 3. UI components

Vue files from `create` / `add` are yours — edit freely.

Restore a template:

```bash
npx @b4moss/hermit-crumb add SiteHeader --force
```

Without `--force`, existing files are left alone. Package updates alone never rewrite them.

## 4. Nav and i18n

- Structure: `app/config/docsNav.ts` (`path` / `labelKey` / `parent`)
- Labels: `i18n/locales/{ja,en}.ts` → `nav.*`
- After adding pages, keep `nitro.prerender.routes` in sync for SSG

## 5. Runtime precedence

| Target | Precedence |
| --- | --- |
| `runtimeConfig.public` | Consumer `nuxt.config` wins over site meta merge |
| color-mode | Consumer options merge onto module defaults |
| CSS | Later consumer styles win |

## Relation to package publishing (maintainers)

npm `@b4moss/hermit-crumb` publishes when a `v*` tag matches the `release` branch. Consumer sites only depend on a published version — they do not run that publish flow. Site look, docs, and meta always go through the override paths on this page.
