# playground

本リポジトリ内のデモ／サンプルサイト。`@b4moss/hermit-crumb` module（Pico.css + カラー変数含む）の利用例。Netlify preview（`preview-site` CD）の対象。

## 起動

前提: Node.js **>= 22.19**。

```shell
npm install
npm run build -w @b4moss/hermit-crumb
npm run dev:playground
# または
npm run generate:playground
```

## テーマ（Phase 3）

- Pico.css とデフォルトトークンは **module が注入**する（利用側で Pico を直 import しない）
- ライト／ダークは `@nuxtjs/color-mode`（`data-theme`）と連携
- サイトカラーの差し替えは CSS 変数の上書きのみで行う

デモの上書き例: [`app/assets/css/theme-override.css`](./app/assets/css/theme-override.css)  
（既定のティールをインディゴ系に変更。コンポーネントは未変更）

```css
:root,
[data-theme="light"] {
  --pico-primary: #3b5bdb;
  /* ... */
}
```

上書きを外す場合は `nuxt.config.ts` の `css` から当該ファイルを削除する。

## 現状

- Phase 2: module 利用側（UI / content / `docsNav` は playground 所有）
- Phase 3: Pico + カラー変数
- CLI / Netlify CD は後続 Phase
