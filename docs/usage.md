# Usage

## Create a new site

```shell
npx @b4moss/hermit-crumb create my-docs
cd my-docs
cp site.meta.yaml.example site.meta.yaml   # optional
npm install
npm run dev
```

`create` writes a Nuxt app with:

- `@b4moss/hermit-crumb` wired in `nuxt.config.ts`
- JA/EN usage docs under `content/` (also JSON-LD / MDC samples)
- Layouts: `docs` (sidebar + TOC) and `default` (no sidebar/TOC); content pages use `docs` by default.
- Default UI: `SiteHeader`, `SiteFooter`, `DocsSidebar`, `HeaderPrefsMenu`, `HeaderDropdown`, plus content helpers (`FaqList`, `FaqItem`, `CollapseBox`, `DocsPager`, `DocsJsonLd`, `DocsToc`)
- `site.meta.yaml.example`, `app/config/docsNav.ts`, i18n locales

Options:

| Flag | Effect |
| --- | --- |
| `--force` | Overwrite existing files in the target directory |

Generated files belong to your project. Package updates do not rewrite them.

## Add components

Run inside a Nuxt project (`nuxt.config.*` required):

```shell
npx @b4moss/hermit-crumb add --list
npx @b4moss/hermit-crumb add DocsPager
npx @b4moss/hermit-crumb add DocsPager --force
```

| Flag | Effect |
| --- | --- |
| `--list` | List template names and output paths |
| `--force` | Overwrite an existing file |
| `--cwd <dir>` | Project root (default: current directory) |

Without `--force`, existing files are skipped.

Templates and destinations are defined in `packages/hermit-crumb/src/cli/templates.mjs`.

## Module-only

```shell
npm install @b4moss/hermit-crumb
```

```ts
export default defineNuxtConfig({
  modules: ["@b4moss/hermit-crumb"],
})
```

Peer dependencies (also installed by the module when `installDeps` is true): `@nuxt/content`, `@nuxtjs/i18n`, `@nuxtjs/color-mode`, `@nuxt/scripts`, `nuxt` ^4.5.2.

Configure Content / i18n / color-mode / scripts in your own `nuxt.config.ts`. See [`playground/nuxt.config.ts`](../playground/nuxt.config.ts) for a working example.

## Ownership

| Stays with the package | You own (after create/add) |
| --- | --- |
| Nuxt module, Pico + default tokens | `app/components/**` |
| Auto-imported composables / utils | `content/**`, `app/config/docsNav.ts` |
| `site.meta.yaml` shape / example | `site.meta.yaml` values, override CSS |
