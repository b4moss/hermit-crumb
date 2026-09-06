---
# @graph: WebPage + WebSite + TechArticle + SoftwareSourceCode
title: はじめに
description: hermit-crumb でドキュメントサイトを起こす最短手順
schemaRole: TechArticle
---

# はじめに

最短経路は CLI の `create` です。生成物はあなたのプロジェクトになります（パッケージ更新で上書きされません）。

## サイトを作る

```bash
npx @b4moss/hermit-crumb create my-docs
cd my-docs
cp site.meta.yaml.example site.meta.yaml   # 任意
npm install
npm run dev
```

`create` が書き出す主なもの:

- `nuxt.config.ts` に `@b4moss/hermit-crumb` を配線
- JA/EN の使い方コンテンツ（この一連の Markdown）
- UI: `SiteHeader` / `SiteFooter` / `DocsSidebar` / FAQ・ページャーなど
- `app/config/docsNav.ts`、`i18n/locales/`、`site.meta.yaml.example`

| Flag | 効果 |
| --- | --- |
| `--force` | 対象ディレクトリの既存ファイルを上書き |

## 開発と静的生成

```bash
npm run dev
npm run generate   # 出力は .output/public
```

## カスタマイズの入口

| 場所 | 内容 |
| --- | --- |
| `site.meta.yaml` | サイト名・URL・GitHub / npm・**SoftwareSourceCode** |
| Markdown frontmatter | `title` / `description` / `schemaRole` または `jsonLd` |
| 本文の `::faq-item` | **FAQPage** の Q/A |
| `app/config/docsNav.ts` | サイドバー／ページャー |
| `i18n/locales/` | UI 文言（`nav.*` 含む） |
| CSS 変数オーバーライド | テーマ（Pico トークン） |

次は [概要](./overview.md) で所有権の境界を、[導入](./install.md) で `add` とモジュールのみ導入を確認してください。
