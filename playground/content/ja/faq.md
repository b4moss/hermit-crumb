---
# @graph: WebPage + WebSite + FAQPage + SoftwareSourceCode
title: FAQ
description: hermit-crumb のよくある質問（MDC アコーディオンと FAQPage JSON-LD）
schemaRole: FAQPage
---

# FAQ

よくある質問です。`schemaRole: FAQPage` と本文の `::faq-item` が JSON-LD の Q/A になる見本でもあります。

::faq-list
:::faq-item{question="site.meta.yaml はどこに置きますか？"}
プロジェクトルートに `site.meta.yaml.example` をコピーして `site.meta.yaml` を作成します。未作成の場合は example → パッケージ同梱 example → 既定値の順でフォールバックします。
:::

:::faq-item{question="パッケージを更新したら UI も変わりますか？"}
変わりません。`create` / `add` で出したファイルはあなたの所有です。テンプレートに戻すときだけ `npx @b4moss/hermit-crumb add <Name> --force` を使います。
:::

:::faq-item{question="モジュールのスタイルを無効にできますか？"}
`hermitCrumb: { injectStyles: false }` にすると Pico / トークン注入を止められます。その場合は自分でスタイルを読み込みます。色だけ変えるなら CSS 変数オーバーライドを推奨します。
:::

:::faq-item{question="JSON-LD はいつ決まりますか？"}
SSR / SSG のレンダ時に `useJsonLd()` が `@graph` を組み立て、`useHead` 経由で各ページの head に挿入します。詳細は [JSON-LD](./json-ld.md) を参照してください。
:::

:::faq-item{question="FAQ の Q/A はどう書けばよいですか？"}
`::faq-list` の中に `::faq-item{question="..."}` を並べます。回答はスロット本文（Markdown 可）です。本文から収集され `FAQPage.mainEntity` になります。
:::

:::faq-item{question="npm への公開手順は利用側でも必要ですか？"}
いいえ。利用側は公開済み `@b4moss/hermit-crumb` を依存に取るだけです。npm 公開フロー（`release` + `v*` タグ）はパッケージメンテナ向けです。サイト側の差し替えは [オーバーライド](./customize.md) を参照してください。
:::
::
