# `@b4moss/hermit-crumb`

Nuxt v4 tech documentation site shell (module + CLI).

## Install

```shell
npx @b4moss/hermit-crumb create my-docs
cd my-docs && npm install && npm run dev
```

Or add the module to an existing Nuxt app:

```shell
npm install @b4moss/hermit-crumb
```

```ts
export default defineNuxtConfig({
  modules: ["@b4moss/hermit-crumb"],
})
```

## CLI

```shell
npx @b4moss/hermit-crumb create my-docs
npx @b4moss/hermit-crumb add --list
npx @b4moss/hermit-crumb add DocsPager
```

Generated UI is owned by your project; updates never overwrite it unless you pass `--force`.

## Docs

Full documentation: [hermit-crumb docs](https://github.com/b4moss/hermit-crumb/tree/main/docs).

- [Usage](https://github.com/b4moss/hermit-crumb/blob/main/docs/usage.md)
- [Module](https://github.com/b4moss/hermit-crumb/blob/main/docs/module.md)
- [Theming](https://github.com/b4moss/hermit-crumb/blob/main/docs/theming.md)
- [site.meta.yaml](https://github.com/b4moss/hermit-crumb/blob/main/docs/site-meta.md)
- [Changelog](https://github.com/b4moss/hermit-crumb/blob/main/CHANGELOG.md)
