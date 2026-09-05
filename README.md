# hermit-crumb

Nuxt v4 ベースのテックドキュメントサイト向けシェル。npm パッケージ名は `@b4moss/hermit-crumb`。初回公開は **v0.1.0**。

テックドキュメントサイトを素早く立ち上げるための基盤で、自由度を残しつつ必要な構成（ナビ、i18n、メタ、JSON-LD など）を揃える。スタイルベースは Pico.css、カラーは CSS 変数でサイトごとに差し替える。

## ゴール

- v0.1.0 を npmjs.org で公開する
- 本リポジトリ内のデモサイトを Netlify で preview する

## 方針（要約）

- 殻は Nuxt module として npm 配信（公開 API は module 経由のみ）
- 利用開始は新規 `create` が主。UI は基本 `add` で利用側に生成して所有する
- create 時はシェル＋代表ページに加え、Header / Footer / Sidebar / ConfigDropdown をデフォルト生成
- **Pico.css** をスタイルベース、**CSS 変数**でカラーテーマをサイトごと差し替え
- `site.meta.yaml` はスキーマをパッケージ、値を利用側が持つ
- 移植元は `b4moss/git-template` の `doc-site` ブランチ

## 仕様書

詳細は [`docs/specs/`](./docs/specs/README.md) を正とする。

- [概要（v0.1.0 スコープ）](./docs/specs/overview.md)
- [テーマ（Pico + CSS 変数）](./docs/specs/architecture/theming.md)
- [決定事項](./docs/specs/decisions.md)
