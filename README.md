# hermit-crumb

Nuxt v4 ベースのテックドキュメントサイト向けシェル。npm パッケージ名は `@b4moss/hermit-crumb`。

テックドキュメントサイトを素早く立ち上げるための基盤で、自由度を残しつつ必要な構成（ナビ、i18n、メタ、JSON-LD など）を揃える。

## ゴール

- npmjs.com で公開パッケージとして配信する
- 本リポジトリ内のデモサイトを Netlify で preview する

## 方針（要約）

- 殻は Nuxt module として npm 配信（公開 API は module 経由のみ）
- 利用開始は新規 `create` が主。UI は基本 `add` で利用側に生成して所有する
- create 時はシェル＋代表ページに加え、Header / Footer / Sidebar / ConfigDropdown をデフォルト生成
- 見た目の主契約は CSS 変数。`site.meta.yaml` はスキーマをパッケージ、値を利用側が持つ
- 移植元は `b4moss/git-template` の `doc-site` ブランチ

## 仕様書

詳細は [`docs/specs/`](./docs/specs/README.md) を正とする。

- [概要](./docs/specs/overview.md)
- [配信境界](./docs/specs/architecture/distribution.md)
- [決定事項](./docs/specs/decisions.md)
