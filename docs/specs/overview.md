# 概要

## プロダクト

- **名称**: hermit-crumb
- **npm パッケージ**: `@b4moss/hermit-crumb`
- **位置づけ**: Nuxt v4 ベースのテックドキュメントサイト向けシェル
- **初回公開バージョン**: **v0.1.0**（本仕様の実現をもって npmjs.org に公開）
- **リポジトリ構成**: npm workspaces。公開パッケージは `packages/hermit-crumb`、本リポ内デモは `playground`（詳細は [architecture/distribution.md](./architecture/distribution.md)）

## 目的

- テックドキュメント Web サイトを高速に立ち上げられるテンプレート／基盤を提供する
- ある程度の自由度を残しつつ、テックドキュメントに必要な構成（ナビ、i18n、メタ、JSON-LD 等）を最初から揃える

## ゴール

1. **npm で配信**する（npmjs.com / npmjs.org の公開パッケージ）
2. **preview サイトを Netlify で配信**する（本リポジトリ内のデモ／サンプルサイト）
3. **スタイルベースに Pico.css** を採用し、**CSS 変数でサイトごとのカラーテーマ差し替え**を容易にする
4. **CD** で npm／Netlify を自動リリースする（ブランチトリガーは [delivery/cd.md](./delivery/cd.md)）

## スコープ（v0.1.0）

v0.1.0 は、以下を満たした状態で初回 npm 公開する。

- `b4moss/git-template:doc-site` の現行機能の一括移植
- Nuxt module としての殻の提供（公開 API は module 経由のみ）
- CLI: 新規プロジェクト向け `create`、コンポーネント向け `add`
- `site.meta.yaml` スキーマと example の提供
- **Pico.css をスタイルのベース**として導入
- **CSS 変数によるカラーテーマ差し替え**（サイトごと）
- 本リポ内デモサイトと Netlify preview
- **CD**: `release`（新タグ付きコミットのマージ）→ npm、`preview-site`（マージ）→ Netlify
- `doc-site` 利用者向け移行ガイド（ブランチ廃止そのものはオーナー判断）

## 非スコープ（v0.1.0）

- 既存 Nuxt アプリへの後付けインストール（`init` 等）— 後回し
- Nuxt / Content / i18n 等の最新 major への継続追従 — 別判断
- git テンプレート差分運用を主戦略とすること
- 深いコンポーネント継承（`extends`）を推奨カスタム手段にすること
- Pico 以外の CSS フレームワークの併用を前提にすること

## 移植元

| 項目 | 値 |
| --- | --- |
| リポジトリ | https://github.com/b4moss/git-template |
| ブランチ | `doc-site` |
| 現状スタック（固定方針） | Nuxt `^4.5.2`、`@nuxt/content` `^3.14.0`、`@nuxtjs/i18n` `^9.5.6`、`@nuxtjs/color-mode` `^4.0.1`、`@nuxt/scripts` `^1.3.0` など（`doc-site` の `package.json` に準拠） |
| スタイルベース（追加） | Pico.css（v0.1.0 で導入。具体バージョンは実装時に固定） |

## 関連文書

- 配信境界: [architecture/distribution.md](./architecture/distribution.md)
- テーマ: [architecture/theming.md](./architecture/theming.md)
- 公開: [delivery/publishing.md](./delivery/publishing.md)
- CD: [delivery/cd.md](./delivery/cd.md)
- ロードマップ（エージェント実装単位・Multi task 含む）: [delivery/roadmap.md](./delivery/roadmap.md)
- 決定ログ: [decisions.md](./decisions.md)
