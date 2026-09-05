# hermit-crumb 仕様書

本ディレクトリは、`@b4moss/hermit-crumb` の移行・実装・npm パッケージ化に関する仕様の正典です。概要のみ `README.md`、詳細はここに置きます。

## 文書一覧

| 文書 | 内容 |
| --- | --- |
| [overview.md](./overview.md) | 目的・ゴール・スコープ・非スコープ |
| [architecture/distribution.md](./architecture/distribution.md) | 配信モデルと所有境界（npm / create / add） |
| [architecture/module-api.md](./architecture/module-api.md) | Nuxt module 公開 API |
| [architecture/theming.md](./architecture/theming.md) | テーマ（Pico.css + CSS 変数） |
| [cli/create-and-add.md](./cli/create-and-add.md) | `create` / `add` の振る舞い |
| [contracts/site-meta.md](./contracts/site-meta.md) | `site.meta.yaml` 契約 |
| [contracts/versioning.md](./contracts/versioning.md) | 依存バージョンと semver |
| [delivery/publishing.md](./delivery/publishing.md) | npmjs 公開と Netlify preview |
| [delivery/cd.md](./delivery/cd.md) | CD（`release`→npm、`preview-site`→Netlify） |
| [delivery/migration.md](./delivery/migration.md) | `doc-site` からの移植と移行ガイド |
| [delivery/roadmap.md](./delivery/roadmap.md) | v0.1.0 までのフェーズ・タスク・エージェント／Multi task 方針 |
| [decisions.md](./decisions.md) | 決定事項ログ（1–20） |

## 用語

| 用語 | 意味 |
| --- | --- |
| 殻 / シェル | Nuxt アプリ骨格、module 接続、共通ロジック |
| 利用側 | `create` で生成されたプロジェクト（またはその保守者） |
| 生成物 | CLI が書き出した利用側所有のファイル |
| `doc-site` | `b4moss/git-template` の `doc-site` ブランチ（移植元） |
