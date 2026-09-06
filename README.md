# hermit-crumb

Nuxt v4 shell for tech documentation sites. Published as **`@b4moss/hermit-crumb`** (Nuxt module + CLI).

It scaffolds nav, i18n, site meta, JSON-LD, and a Pico.css theme with CSS-variable colors. Shell logic stays in the module; UI you generate with the CLI is yours to edit.

## Quick start

```shell
npx @b4moss/hermit-crumb create my-docs
cd my-docs
cp site.meta.yaml.example site.meta.yaml   # optional
npm install
npm run dev
```

Add or restore UI components later:

```shell
npx @b4moss/hermit-crumb add --list
npx @b4moss/hermit-crumb add DocsPager
```

Module-only install:

```shell
npm install @b4moss/hermit-crumb
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@b4moss/hermit-crumb"],
})
```

Requires **Node.js >= 24.20**.

## Repository layout

| Path | Role |
| --- | --- |
| [`packages/hermit-crumb`](./packages/hermit-crumb) | Published package (module + CLI) |
| [`playground`](./playground) | Demo site (create-equivalent; Netlify target) |
| [`docs`](./docs/README.md) | Documentation index (incl. [test specs](./docs/tests/README.md)) |
| [`charter`](./charter/README.md) | Dev charter submodule (`b4moss/charter` `docs` branch) |

## Develop this monorepo

```shell
git submodule update --init --recursive
npm install
npm run lint
npm run typecheck
npm run build
npm run test
npm run generate:playground
npm run dev:playground
```

## Docs

See [`docs/README.md`](./docs/README.md) for usage, module API, theming, `site.meta.yaml`, publishing, and migration.
