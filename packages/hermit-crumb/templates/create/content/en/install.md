---
# @graph: WebPage + WebSite + TechArticle + SoftwareSourceCode
title: Setup
description: create, add, and module-only installation paths
schemaRole: TechArticle
---

# Setup

Three install paths: `create` for a new site, `add` for components in an existing app, and module-only when you already have Nuxt.

## 1. `create` (recommended)

```bash
npx @b4moss/hermit-crumb create my-docs
cd my-docs
cp site.meta.yaml.example site.meta.yaml
npm install
npm run dev
```

| Flag | Effect |
| --- | --- |
| `--force` | Overwrite existing files |

## 2. `add` (components)

Run inside a Nuxt project (`nuxt.config.*` required):

```bash
npx @b4moss/hermit-crumb add --list
npx @b4moss/hermit-crumb add DocsPager
npx @b4moss/hermit-crumb add DocsPager --force
```

| Flag | Effect |
| --- | --- |
| `--list` | List template names and output paths |
| `--force` | Overwrite an existing file |
| `--cwd <dir>` | Project root (default: current directory) |

Without `--force`, existing files are skipped. Templates are defined in the package `src/cli/templates.mjs`.

## 3. Module-only

```bash
npm install @b4moss/hermit-crumb
```

```ts
export default defineNuxtConfig({
  modules: ["@b4moss/hermit-crumb"],
})
```

Configure Content / i18n / color-mode / scripts in your own `nuxt.config.ts`. See the playground `nuxt.config.ts` for a working example.

Next: [Module](./module.md) for options and the runtime surface.
