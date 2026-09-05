# hermit-crumb

Nuxt v4 ベースのテックドキュメントサイト向けシェル。npm パッケージ名は `@b4moss/hermit-crumb`。初回公開は **v0.1.0**。

テックドキュメントサイトを素早く立ち上げるための基盤で、自由度を残しつつ必要な構成（ナビ、i18n、メタ、JSON-LD など）を揃える。スタイルベースは Pico.css、カラーは CSS 変数でサイトごとに差し替える。

## ゴール

- v0.1.0 を npmjs.org で公開する
- 本リポジトリ内のデモサイトを Netlify で preview する
- CD: `release`（新タグ付きコミットのマージ）→ npm、`preview-site`（マージ）→ Netlify

## 方針（要約）

- 殻は Nuxt module として npm 配信（公開 API は module 経由のみ）
- 利用開始は新規 `create` が主。UI は基本 `add` で利用側に生成して所有する
- create 時はシェル＋代表ページに加え、Header / Footer / Sidebar / ConfigDropdown をデフォルト生成
- **Pico.css** をスタイルベース、**CSS 変数**でカラーテーマをサイトごと差し替え
- `site.meta.yaml` はスキーマをパッケージ、値を利用側が持つ
- 移植元は `b4moss/git-template` の `doc-site` ブランチ

## リポジトリ構成

npm workspaces のモノレポ。

| パス | 役割 |
| --- | --- |
| [`packages/hermit-crumb`](./packages/hermit-crumb) | 公開パッケージ `@b4moss/hermit-crumb`（module + CLI） |
| [`playground`](./playground) | create 相当のデモ（Netlify preview 対象） |
| [`docs/specs`](./docs/specs) | 仕様の正典 |
| [`docs/migration.md`](./docs/migration.md) | `doc-site` → hermit-crumb 移行ガイド |

```shell
npm install
npm run lint
npm run typecheck
npm run build
npm run test
npm run generate:playground
```

`npm install` の `postinstall` で `@b4moss/hermit-crumb` をビルドする。Node.js **>= 22.19**（Nuxt `^4.5.2` の engines に合わせる）。

### CLI（ローカル）

```shell
node packages/hermit-crumb/bin/hermit-crumb.mjs --help
node packages/hermit-crumb/bin/hermit-crumb.mjs create my-docs
node packages/hermit-crumb/bin/hermit-crumb.mjs add --list
```

## 仕様書

詳細は [`docs/specs/`](./docs/specs/README.md) を**正**とする。実装や公開契約を変える差分では、コードとあわせて同ディレクトリの仕様も更新する。

- [概要（v0.1.0 スコープ）](./docs/specs/overview.md)
- [ロードマップ（〜 v0.1.0／エージェント・Multi task）](./docs/specs/delivery/roadmap.md)
- [配信モデルとリポ構成](./docs/specs/architecture/distribution.md)
- [CD（release / preview-site）](./docs/specs/delivery/cd.md)
- [テーマ（Pico + CSS 変数）](./docs/specs/architecture/theming.md)
- [移行ガイド（実装）](./docs/migration.md)
- [決定事項](./docs/specs/decisions.md)
