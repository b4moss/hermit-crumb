---
# =============================================================================
# 【このページで出したいもの】詳細記法の見本
#   @graph = WebPage + TechArticle + BreadcrumbList + SoftwareSourceCode + ItemList
#
# 【どこに何を書くか】
#   (A) OSS 情報     → site.meta.yaml の software.*（全ページ共通）
#   (B) ページの役割 → 下の jsonLd.entities（TechArticle）
#   (C) 名前・説明   → title / description
#   (D) エスケープ   → jsonLd.extra（標準セット外）
# =============================================================================
title: JSON-LD
description: hermit-crumb の JSON-LD（@graph）の書き方と詳細 frontmatter 見本

jsonLd:
  webPage:
    breadcrumb:
      "@id": https://example.com/ja/json-ld#breadcrumb
  entities:
    - type: TechArticle
      datePublished: "2026-01-01"
      dateModified: "2026-09-06"
      proficiencyLevel: Beginner
      author:
        "@type": Organization
        name: Bicycle for Mind LLC.
    - type: BreadcrumbList
      "@id": https://example.com/ja/json-ld#breadcrumb
      itemListElement:
        - "@type": ListItem
          position: 1
          name: ホーム
          item: https://example.com/ja
        - "@type": ListItem
          position: 2
          name: JSON-LD
          item: https://example.com/ja/json-ld
  extra:
    - "@type": ItemList
      "@id": https://example.com/ja/json-ld#checklist
      name: JSON-LD チェックリスト
      itemListElement:
        - "@type": ListItem
          position: 1
          name: site.meta.yaml の software
        - "@type": ListItem
          position: 2
          name: schemaRole または jsonLd.entities
---

# JSON-LD

各ページの `<head>` に、`@graph` 形式の JSON-LD が1つ入ります。このページ自体が **詳細記法（`jsonLd`）の実装見本**です。短縮形は他ページの `schemaRole` を参照してください。

## 基本方針

1. **1ページ = 1スキーマではない。** 本体は常に `WebPage`。役割（`TechArticle` など）は別エンティティとして並び、`@id` で結ぶ
2. **定型は自動、文脈依存だけ書く。** `@id` / `isPartOf` などは自動。`datePublished` などは自分で書く

## どこに何を書くか

| 出したいもの | 書く場所 |
| --- | --- |
| `WebSite`、`SoftwareSourceCode`（全ページ） | `site.meta.yaml` |
| `Organization`（全ページ） | `site.meta.yaml` → `organization` |
| 標準外エンティティ（全ページ） | `site.meta.yaml` → `jsonLdExtra` |
| `WebPage` の基本 | `title` / `description` |
| 役割エンティティ | `schemaRole` または `jsonLd.entities` |
| `WebPage` への追加プロパティ | `jsonLd.webPage` |
| 標準外（このページだけ） | `jsonLd.extra` |
| FAQ の Q/A | 本文の `::faq-list` / `::faq-item` |

用途の分け方:

- **(i) 標準エンティティにプロパティを足す** → `jsonLd.webPage` / `jsonLd.entities`
- **(ii) 標準セットに無いエンティティを丸ごと足す** → `jsonLdExtra` / `jsonLd.extra`

## 短縮形（`schemaRole`）

```yaml
---
title: はじめに
description: hermit-crumb でドキュメントサイトを起こす最短手順
schemaRole: TechArticle
---
```

これで `WebPage` + `WebSite` + `SoftwareSourceCode` + `TechArticle` が出ます。

使える値: `TechArticle` / `HowTo` / `FAQPage`。

## 詳細形（このページの frontmatter）

プロパティ追加や複数エンティティは `jsonLd` を使います。このファイル先頭の YAML が実例です。

- `jsonLd.webPage` — `WebPage` に足すプロパティ
- `jsonLd.entities` — 役割エンティティの配列（`type` 以外はそのまま schema.org プロパティ）
- `jsonLd.extra` — 既定値なしのエスケープハッチ（`@type` / `@id` は自分で書く）

### 既知型と未知型

- **既知型**（`TechArticle` / `HowTo` / `FAQPage`）: 規約の `@id` / `headline` などが付いたうえでマージ
- **未知型**（例: `BreadcrumbList`）: `@type` と `@id` だけ自動。関係は自分で書く

### 自動生成される値（書かなくてよい）

- `WebPage`: `@id` / `url` / `name`←`title` / `inLanguage` / `isPartOf`→`WebSite` / `about`→`SoftwareSourceCode`
- `TechArticle`: `@id`=`{URL}#article` / `headline`←`title` / `isPartOf` / `about`
- `HowTo`: `@id`=`{URL}#howto` / `name`←`title` / `isPartOf` / `about`
- `FAQPage`: `@id`=`{URL}#faq` / `mainEntity`←本文の `::faq-item`

### 上書き規則

- マージは1階層。同じキーはユーザー指定が勝つ
- `WebPage` の `@id` を変えたら、役割の `isPartOf` もそれに追従
- `FAQPage.mainEntity` を frontmatter で書いた場合は本文収集より優先
- **`jsonLd.entities` があるとき `schemaRole` は無視**（ビルド時警告）。どちらか一方に

## Organization（サイト全体）

```yaml
organization:
  name: Example Inc.
  url: https://example.com/
  logo: https://example.com/logo.png
  sameAs:
    - https://github.com/example
```

未設定なら Organization も publisher も出ません。

## FAQ の Q/A

frontmatter には書かず、本文に:

```md
::faq-list
:::faq-item{question="質問文"}
回答（Markdown 可）
:::
::
```

実例は [FAQ](./faq.md)。

## 日付

必ずクォートする: `datePublished: "2026-01-01"`（クォートなしは YAML が Date 解釈する）。

## 見本ページ一覧

| ファイル | パターン |
| --- | --- |
| `index.md` | `schemaRole` なし |
| `overview.md` / `install.md` / `getting-started.md` / `module.md` / `customize.md` | `schemaRole: TechArticle` |
| **このページ** | `jsonLd` 詳細記法 |
| `tutorial.md` | `schemaRole: HowTo` |
| `faq.md` | `schemaRole: FAQPage` + MDC |

より長いリファレンスは同梱の `docs/jsonld_ja.md` にもあります。
