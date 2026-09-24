# module

Nuxt モジュールセットアップ。対象: `packages/hermit-crumb/src/module.ts`。  
`@nuxt/kit` の `defineNuxtModule` / `installModule` / `addImportsDir` 等に依存するため、結合は Nuxt テストハーネスまたは kit モックで行う。

### hermitCrumb module setup

- `site.meta.yaml` を読み public runtimeConfig へマージする（消費者の既存 public が優先）
- 必要に応じて依存モジュールとスタイルを導入する
- composables / utils を imports に登録する

#### テスト：正常系

- デフォルト options（`installDeps: true`, `injectStyles: true`）で Content / i18n / color-mode / scripts が install される
- `injectStyles: true` のとき css 先頭付近に Pico と tokens.css が並ぶ（消費者 css は後方に残る）
- runtimeConfig.public に siteName / siteUrl / software / organization / jsonLdExtra 等が入り、消費者側の同名キーが勝つ
- i18n が存在し `baseUrl` 未設定のとき `siteMeta.siteUrl` が入る
- colorMode に Pico 向け `dataValue: "theme"` 等が設定され、消費者 colorMode がマージで優先される
- `addImportsDir`（composables・utils）と `addServerImportsDir`（utils）が呼ばれる

#### テスト: 異常系

- `installDeps: false` のとき依存 `installModule` を呼ばない
- `injectStyles: false` のときモジュール起因の css 注入をしない
- site meta 読込失敗時もモジュール setup が例外で止まらず、デフォルトメタで続行できる
- i18n オプション自体が無いとき `baseUrl` 代入をスキップする（例外にしない）

----

以上
