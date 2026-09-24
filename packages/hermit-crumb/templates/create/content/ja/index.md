---
# @graph: WebPage + WebSite + SoftwareSourceCode（schemaRole なし）
# 書く場所: site.meta.yaml（共通）/ title・description（このページ）
# 詳細: docs/jsonld_ja.md および [JSON-LD](./json-ld.md)
title: ホーム
description: Nuxt v4 向け技術ドキュメントサイト用シェル @b4moss/hermit-crumb
---

# hermit-crumb

`@b4moss/hermit-crumb` は、Nuxt v4 向けの**技術ドキュメントサイト用シェル**です。Nuxt モジュールと CLI（`create` / `add`）を提供し、ナビ・i18n・サイトメタ・JSON-LD・Pico.css トークンなどのシェルロジックをパッケージ側に置きつつ、UI とコンテンツは利用側の所有にします。

この playground（および `create` が書き出す初期コンテンツ）は、プロダクトの使い方解説であり、同時に Markdown / frontmatter / MDC の実装見本でもあります。

## 読む順番

1. [はじめに](./getting-started.md) — `create` でサイトを起こす
2. [概要](./overview.md) — モジュール／CLI／所有権の境界
3. [導入](./install.md) — `create` / `add` / モジュールのみ
4. [モジュール](./module.md) — `hermitCrumb` オプションとランタイム
5. [オーバーライド](./customize.md) — テーマ・コンポーネント・メタの差し替え
6. [JSON-LD](./json-ld.md) — `@graph` の書き方（詳細見本）
7. [チュートリアル](./tutorial.md) — スキャフォールドから公開までの手順

## JSON-LD 見本マップ

| ページ | 書くこと | 出る `@graph`（概略） |
| --- | --- | --- |
| このページ | `schemaRole` なし | WebPage + WebSite + SoftwareSourceCode |
| [概要](./overview.md) など | `schemaRole: TechArticle` | + TechArticle |
| [JSON-LD](./json-ld.md) | `jsonLd`（詳細記法） | + TechArticle + BreadcrumbList + … |
| [チュートリアル](./tutorial.md) | `schemaRole: HowTo` | + HowTo |
| [FAQ](./faq.md) | `schemaRole: FAQPage` + `::faq-item` | + FAQPage |
