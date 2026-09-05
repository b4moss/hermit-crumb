---
# =============================================================================
# 【このページで出したいもの】（#40 推奨）
#   @graph = WebPage + TechArticle + SoftwareSourceCode
# =============================================================================
#
# 【どこに何を書くか】
#
#   (A) OSS 情報     → site.meta.yaml の software.*（全ページ共通）
#   (B) ページの役割 → 下の schemaRole: TechArticle
#   (C) 名前・説明   → 下の title / description
#
# -----------------------------------------------------------------------------
# (B)(C) このファイル（↓が実体）
# -----------------------------------------------------------------------------
title: API reference
description: Dummy API reference page (JSON-LD TechArticle sample)

# schemaRole: TechArticle だけでも動くが、ここでは詳細記法の見本として
# jsonLd を使い、規約で自動生成される値にプロパティを足している。
# 記法の全体像は docs/jsonld_ja.md を参照。
jsonLd:
  webPage:
    # WebPage 自体に足す。実体は下の BreadcrumbList で、ここは @id 参照
    breadcrumb:
      "@id": https://example.com/en/api#breadcrumb
  entities:
    # 既知型: 規約の @id / headline / isPartOf / about に下記が足される
    - type: TechArticle
      # 日付は必ずクォートする（YAML が Date に解釈するため）
      datePublished: "2026-01-01"
      dateModified: "2026-01-15"
      proficiencyLevel: Expert
      author:
        "@type": Organization
        name: Example Inc.
    # 未知型: @type と @id だけが自動。関係はすべて自分で書く
    - type: BreadcrumbList
      "@id": https://example.com/en/api#breadcrumb
      itemListElement:
        - "@type": ListItem
          position: 1
          name: Home
          item: https://example.com/en
        - "@type": ListItem
          position: 2
          name: API reference
          item: https://example.com/en/api
#
#   title        → WebPage.name / TechArticle.headline
#   description  → WebPage.description / TechArticle.description
#   jsonLd.entities[].type → @graph に追加するエンティティ
#
# -----------------------------------------------------------------------------
# 出る JSON-LD（イメージ）
# -----------------------------------------------------------------------------
# {
#   "@context": "https://schema.org",
#   "@graph": [
#     { "@type": "WebPage", "@id": "https://example.com/en/api", "name": "API reference" },
#     {
#       "@type": "TechArticle",
#       "@id": "https://example.com/en/api#article",
#       "headline": "API reference",
#       "isPartOf": { "@id": "https://example.com/en/api" }
#     },
#     {
#       "@type": "SoftwareSourceCode",
#       "@id": "https://example.com/#software",
#       "name": "My OSS",
#       "codeRepository": "https://github.com/example/my-oss"
#     }
#   ]
# }
#
# 関数ごとの schema.org 型は出さない。追加したい場合は #45 の jsonLdExtra ハッチへ
# =============================================================================
---

# API reference

Dummy API page.

**出し方:** `schemaRole: TechArticle` + `title` / `description`（このファイル）と `site.meta.yaml` の `software.*`。

## `hello(name)`

| Arg | Type | Description |
| --- | --- | --- |
| `name` | `string` | Display name |

Returns: `string`

Replace with your real API docs.
