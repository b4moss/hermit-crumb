# 決定事項ログ

移行・実装・npm パッケージ化に関する合意事項。詳細仕様は各文書を正とする。

| # | 決定 | 要約 | 詳細 |
| --- | --- | --- | --- |
| 1 | 生成境界 | create = シェル＋代表ページ。コンポーネントは add。ただし Header / Footer / Sidebar / ConfigDropdown は create 時デフォルト生成 | [cli/create-and-add.md](./cli/create-and-add.md), [architecture/distribution.md](./architecture/distribution.md) |
| 2 | 公開 API | Nuxt module 経由のみ | [architecture/module-api.md](./architecture/module-api.md) |
| 3 | 入口 | 新規 create 一式が主（既存 Nuxt 後付けは後回し） | [cli/create-and-add.md](./cli/create-and-add.md) |
| 4 | 移植 | `doc-site` 現行機能を一括移植してから npm / CLI 化 | [delivery/migration.md](./delivery/migration.md) |
| 5 | 依存バージョン | `doc-site` 現状に固定（major 追随は別判断） | [contracts/versioning.md](./contracts/versioning.md) |
| 6 | `add` 上書き | 既存ファイルは上書きしない（`--force` のみ） | [cli/create-and-add.md](./cli/create-and-add.md) |
| 7 | `site.meta.yaml` | パッケージがスキーマ＋example、利用側は値のみ（スキーマは semver 対象） | [contracts/site-meta.md](./contracts/site-meta.md) |
| 8 | semver major | 公開契約の破壊 ＋ デフォルト見た目／クラス構造の大きな変更 | [contracts/versioning.md](./contracts/versioning.md) |
| 9 | 公開先 | npmjs.com の公開パッケージ | [delivery/publishing.md](./delivery/publishing.md) |
| 10 | Netlify preview | 本リポ内のデモ／サンプルサイト | [delivery/publishing.md](./delivery/publishing.md) |
| 11 | パッケージ名 | `@b4moss/hermit-crumb` | [delivery/publishing.md](./delivery/publishing.md) |
| 12 | 生成パス | Nuxt 慣例＋`doc-site` 命名を踏襲 | [cli/create-and-add.md](./cli/create-and-add.md) |
| 13 | テーマ | CSS 変数を主契約（利用側は変数上書きが基本） | [architecture/theming.md](./architecture/theming.md) |
| 14 | `doc-site` 廃止 | タイミングはオーナー判断。移行ガイドは先に用意 | [delivery/migration.md](./delivery/migration.md) |
| 15 | 代表ページ | `doc-site` 現行 content 一式（日英） | [cli/create-and-add.md](./cli/create-and-add.md) |
| 16 | スタイルベース | Pico.css をスタイルのベースとする | [architecture/theming.md](./architecture/theming.md) |
| 17 | カラーテーマ | CSS 変数でサイトごとのカラー差し替えを容易にする | [architecture/theming.md](./architecture/theming.md) |
| 18 | 初回公開 | 上記までの実現を **v0.1.0** とし npmjs.org に公開する | [delivery/publishing.md](./delivery/publishing.md), [overview.md](./overview.md) |
