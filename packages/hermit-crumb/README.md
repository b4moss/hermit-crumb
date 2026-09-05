# `@b4moss/hermit-crumb`

Nuxt v4 向けテックドキュメントサイトの殻（Nuxt module）。初回公開は **v0.1.0**。

## 使い方

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@b4moss/hermit-crumb"],
  // Content / i18n / color-mode / scripts の詳細オプションは従来どおりここに書く
})
```

- 公開 API は **module 経由のみ**（composables / utils は auto-import）
- **Pico.css** とカラー用 CSS 変数のデフォルトは module が注入する
- サイトカラーは `:root` / `[data-theme]` で変数上書き（コンポーネント編集は不要）

詳細はリポジトリの [`docs/specs`](../../docs/specs/README.md)。

## 開発（モノレポ）

```shell
npm install
npm run build -w @b4moss/hermit-crumb
npm run generate:playground
```

## ステータス

- Phase 2: module 配線・`site.meta.yaml`・ロジック runtime
- Phase 3: Pico.css + カラー変数
- CLI は Phase 4
