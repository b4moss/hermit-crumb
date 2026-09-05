---
# @graph: WebPage + WebSite + TechArticle + SoftwareSourceCode
# 書く場所: site.meta.yaml（共通）/ schemaRole: TechArticle / title・description
# 詳細: docs/jsonld_ja.md
title: はじめに
description: ドキュメントサイト雛形の使い方
schemaRole: TechArticle
---

# はじめに

## 開発サーバ

```bash
npm install
npm run dev
```

## 静的生成

```bash
npm run generate
```

出力は `.output/public` です。

## カスタマイズ要点

| 場所 | 内容 |
| --- | --- |
| `site.meta.yaml`（雛形は `.example`） | サイト名・URL・GitHub・**SoftwareSourceCode** |
| 各 Markdown の frontmatter | `title` / `description` / **`schemaRole`** または **`jsonLd`** |
| FAQ 本文の `::faq-item` | **FAQPage** の Question / Answer |
| `app/config/docsNav.ts` | サイドバー／ページャー |
| `i18n/locales/` | UI 文言（ナビラベル含む） |

## JSON-LD — 「何を書くと何が出るか」ダミー

詳しい記法はリポジトリの `docs/jsonld_ja.md` を参照してください。

| ページ | 書くこと | 出る `@graph` |
| --- | --- | --- |
| [ホーム](./index.md) | `schemaRole` なし | WebPage + SoftwareSourceCode |
| [概要](./overview.md) | `schemaRole: TechArticle` | WebPage + TechArticle + SoftwareSourceCode |
| [インストール](./install.md) | 同上 | 同上 |
| [API](./api.md) | `jsonLd`（詳細記法） | WebPage + TechArticle + BreadcrumbList + … |
| [チュートリアル](./tutorial.md) | `schemaRole: HowTo` | WebPage + HowTo + SoftwareSourceCode |
| [FAQ](./faq.md) | `schemaRole: FAQPage` + `::faq-item` | WebPage + FAQPage + SoftwareSourceCode |
