# `doc-site` からの移植と移行

## 移植方針

1. **`doc-site` の現行機能を一括移植**してから、npm パッケージ化および CLI（`create` / `add`）化する
2. 依存バージョンは移植元に固定する（[../contracts/versioning.md](../contracts/versioning.md)）
3. ファイル配置・コンポーネント名は Nuxt 慣例と `doc-site` 命名を踏襲する

## 移植対象の目安（`doc-site` 時点）

| 領域 | 例 |
| --- | --- |
| アプリ殻 | `app.vue`、layouts、`[...slug].vue` |
| UI | `SiteHeader` / `SiteFooter` / `DocsSidebar` / `HeaderPrefsMenu` / `HeaderDropdown` / `DocsPager` 等 |
| Content コンポーネント | `FaqList` / `FaqItem` / `CollapseBox` |
| ロジック | `useDocsNav`、JSON-LD、FAQ 抽出、`siteMeta` 正規化 |
| content | `content/ja/**`、`content/en/**` |
| 設定 | `nuxt.config.ts`、`content.config.ts`、i18n、color-mode、GTM プラグイン |
| サーバ | sitemap / robots / locale-root / webmanifest 等 |
| ドキュメント | JSON-LD 解説（`docs/jsonld*.md`） |

パッケージ境界への振り分けは [../architecture/distribution.md](../architecture/distribution.md) および [../cli/create-and-add.md](../cli/create-and-add.md) に従う。

## `doc-site` からの差分（v0.1.0 で追加）

- スタイルベースに **Pico.css** を導入する（`doc-site` 時点の独自 CSS 中心から移行）
- カラーテーマは **CSS 変数**でサイトごとに差し替え可能にする
- 詳細は [../architecture/theming.md](../architecture/theming.md)

## 移行ガイド

- **作成主体**: hermit-crumb 側で **移行ガイドを先に用意**する
- **内容の目安**:
  - git-template `doc-site` からの乗り換え手順
  - 所有境界（何が npm で何が生成物か）
  - `site.meta.yaml` / CSS 変数 / content の扱い
  - 破壊的差分がある場合の semver 上の注意
- **配置**: [`docs/migration.md`](../../migration.md)（Phase 5A で初版）

## `doc-site` ブランチの廃止

| 項目 | 決定 |
| --- | --- |
| 廃止タイミング | **オーナー判断**（パッケージ公開と自動同期しない） |
| hermit-crumb 側の義務 | 移行ガイドの用意。廃止操作そのものはスコープ外 |

## 関連決定

- 決定 4, 5, 12, 14, 15, 16, 17 — [decisions.md](../decisions.md)

## 実装順

- 機能移植の本体は Phase 1、境界の module 化は Phase 2、移行ガイド初版は Phase 5（Netlify と Multi task 可）
- 詳細: [roadmap.md](./roadmap.md)
