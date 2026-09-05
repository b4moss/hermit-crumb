# `site.meta.yaml` 契約

## 位置づけ

- パッケージが **スキーマと example** を提供する
- 利用側は **値だけ**を書く
- スキーマ変更は **semver 対象**（破壊的変更は major）

## 読み込み

`doc-site` と同様の優先順を踏襲する。

1. 利用側プロジェクトルートの `site.meta.yaml`
2. 無ければ `site.meta.yaml.example`（フォールバック）
3. どちらも無ければ／パース失敗時は正規化済みデフォルト

読み込んだ結果は正規化のうえ `runtimeConfig.public` に載せる。

## フィールド概要（移植時点の `doc-site` 準拠）

実装の正は移植後のスキーマ定義および example コメントとする。概要のみ記す。

| 領域 | 主なキー | 用途 |
| --- | --- | --- |
| サイト基本 | `siteName`, `siteUrl`, `siteVersion`, `description` | UI・URL 生成・メタ |
| リンク | `githubUrl`, `npmUrl` | ヘッダー等（空なら非表示など既存挙動） |
| フッター | `footerText` | フッター表示 |
| ソフトウェア | `software.*` | JSON-LD `SoftwareSourceCode` |
| 組織 | `organization.*`（任意） | JSON-LD `Organization` / publisher |
| 拡張 | `jsonLdExtra` 等（任意） | サイト全体のエスケープハッチ |

ページ単位の役割（TechArticle / FAQPage / HowTo 等）は Markdown frontmatter（`schemaRole` / `jsonLd`）側。サイト共通の SoftwareSourceCode は YAML 側。

## 破壊的変更の定義

次をスキーマの破壊的変更（major）とする。

- 必須キーの追加（既存 YAML が無効になる）
- キーの削除・リネーム
- 値の型や意味の変更で、既存利用側の意図が壊れるもの
- `runtimeConfig.public` 上の対応フィールドの破壊

後方互換な任意キー追加は minor としうる。

## 関連決定

- 決定 7, 8 — [decisions.md](../decisions.md)
- module: [../architecture/module-api.md](../architecture/module-api.md)
