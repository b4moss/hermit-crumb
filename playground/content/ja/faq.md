---
# @graph: WebPage + WebSite + FAQPage + SoftwareSourceCode
# 書く場所: schemaRole: FAQPage / Q/A は本文 MDC（::faq-item）/ 共通は site.meta.yaml
# 詳細: docs/jsonld_ja.md
title: FAQ
description: よくある質問のサンプル（MDC アコーディオンと FAQPage JSON-LD）
schemaRole: FAQPage
---

# FAQ

このページは FAQ アコーディオンと `FAQPage` JSON-LD のサンプルです。

**出し方:** frontmatter で `schemaRole: FAQPage`、Q/A は下の `::faq-item`、OSS 情報は `site.meta.yaml`。

::faq-list
:::faq-item{question="site.meta.yaml はどこに置きますか？"}
プロジェクトルートに `site.meta.yaml.example` をコピーして `site.meta.yaml` を作成します。未作成の場合は example がフォールバックとして使われます。
:::

:::faq-item{question="JSON-LD はどのタイミングで決まりますか？"}
SSR / SSG のレンダ時に `useJsonLd()` が `@graph` を組み立て、`useHead` 経由で各ページの head に挿入します。
:::

:::faq-item{question="FAQ の Q/A はどう書けばよいですか？"}
`::faq-list` の中に `::faq-item{question="..."}` を並べます。回答はスロット本文（Markdown 可）です。コンポーネントが Q/A を収集し、`FAQPage` に変換します。
:::
::
