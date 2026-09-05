# 概要

## プロダクト

- **名称**: hermit-crumb
- **npm パッケージ**: `@b4moss/hermit-crumb`
- **位置づけ**: Nuxt v4 ベースのテックドキュメントサイト向けシェル

## 目的

- テックドキュメント Web サイトを高速に立ち上げられるテンプレート／基盤を提供する
- ある程度の自由度を残しつつ、テックドキュメントに必要な構成（ナビ、i18n、メタ、JSON-LD 等）を最初から揃える

## ゴール

1. **npm で配信**する（npmjs.com の公開パッケージ）
2. **preview サイトを Netlify で配信**する（本リポジトリ内のデモ／サンプルサイト）

## スコープ（初期リリース）

- `b4moss/git-template:doc-site` の現行機能の一括移植
- Nuxt module としての殻の提供
- CLI: 新規プロジェクト向け `create`、コンポーネント向け `add`
- `site.meta.yaml` スキーマと example の提供
- CSS 変数によるテーマ契約
- 本リポ内デモサイトと Netlify preview
- `doc-site` 利用者向け移行ガイド（ブランチ廃止そのものはオーナー判断）

## 非スコープ（初期）

- 既存 Nuxt アプリへの後付けインストール（`init` 等）— 後回し
- Nuxt / Content / i18n 等の最新 major への継続追従 — 別判断
- git テンプレート差分運用を主戦略とすること
- 深いコンポーネント継承（`extends`）を推奨カスタム手段にすること

## 移植元

| 項目 | 値 |
| --- | --- |
| リポジトリ | https://github.com/b4moss/git-template |
| ブランチ | `doc-site` |
| 現状スタック（固定方針） | Nuxt `^4.5.2`、`@nuxt/content` `^3.14.0`、`@nuxtjs/i18n` `^9.5.6`、`@nuxtjs/color-mode` `^4.0.1`、`@nuxt/scripts` `^1.3.0` など（`doc-site` の `package.json` に準拠） |

## 関連文書

- 配信境界: [architecture/distribution.md](./architecture/distribution.md)
- 決定ログ: [decisions.md](./decisions.md)
