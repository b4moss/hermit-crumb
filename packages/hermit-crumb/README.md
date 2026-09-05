# `@b4moss/hermit-crumb`

Nuxt v4 向けテックドキュメントサイトの殻（Nuxt module + CLI）。**v0.1.0**。

## インストール

```shell
npm install @b4moss/hermit-crumb
```

新規サイト:

```shell
npx @b4moss/hermit-crumb create my-docs
cd my-docs && npm install && npm run dev
```

## Module

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@b4moss/hermit-crumb"],
  // Content / i18n / color-mode / scripts の詳細は従来どおりここに書く
})
```

- 公開 API は **module 経由のみ**（composables / utils は auto-import）
- **Pico.css** とカラー用 CSS 変数のデフォルトは module が注入する
- サイトカラーは `:root` / `[data-theme]` で変数上書き（コンポーネント編集は不要）

## CLI

```shell
npx @b4moss/hermit-crumb --help
npx @b4moss/hermit-crumb create my-docs
npx @b4moss/hermit-crumb add --list
npx @b4moss/hermit-crumb add DocsPager
npx @b4moss/hermit-crumb add DocsPager --force
```

`create` / `add` で生成した UI は **利用側所有**です。既存ファイルは上書きしません（`--force` のみ）。

## ドキュメント

- 仕様: リポジトリ [`docs/specs`](https://github.com/b4moss/hermit-crumb/tree/main/docs/specs)
- 移行: [`docs/migration.md`](https://github.com/b4moss/hermit-crumb/blob/main/docs/migration.md)
- Changelog: [`CHANGELOG.md`](https://github.com/b4moss/hermit-crumb/blob/main/CHANGELOG.md)

## 開発（このモノレポ）

```shell
npm install
npm run build -w @b4moss/hermit-crumb
npm run test -w @b4moss/hermit-crumb
npm run generate:playground
```

## ステータス

- v0.1.0: module・CLI（`create` / `add`）・Pico テーマ・playground・Netlify / npm CD 配線
