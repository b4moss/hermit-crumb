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
title: API リファレンス
description: API リファレンスのダミーページ（JSON-LD TechArticle サンプル）

# schemaRole: TechArticle だけでも動くが、ここでは詳細記法の見本として
# jsonLd を使い、規約で自動生成される値にプロパティを足している。
# 記法の全体像は docs/jsonld_ja.md を参照。
jsonLd:
  webPage:
    # WebPage 自体に足す（自動生成分の上に重ねる）。
    # 実体は下の BreadcrumbList で、ここは @id 参照でつなぐ
    breadcrumb:
      "@id": https://example.com/ja/api#breadcrumb
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
      "@id": https://example.com/ja/api#breadcrumb
      itemListElement:
        - "@type": ListItem
          position: 1
          name: ホーム
          item: https://example.com/ja
        - "@type": ListItem
          position: 2
          name: API リファレンス
          item: https://example.com/ja/api
  # extra は「標準セットに無い型を丸ごと足す」枠。既定値は付かない
  extra:
    - "@type": ItemList
      "@id": https://example.com/ja/api#endpoints
      name: エンドポイント一覧
      itemListElement:
        - "@type": ListItem
          position: 1
          name: GET /health
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
#     { "@type": "WebPage", "@id": "https://example.com/ja/api", "name": "API リファレンス" },
#     {
#       "@type": "TechArticle",
#       "@id": "https://example.com/ja/api#article",
#       "headline": "API リファレンス",
#       "isPartOf": { "@id": "https://example.com/ja/api" }
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

# API リファレンス

ダミーの API ページです。

**出し方:** `schemaRole: TechArticle` + `title` / `description`（このファイル）と `site.meta.yaml` の `software.*`。

## `hello(name)`

| 引数 | 型 | 説明 |
| --- | --- | --- |
| `name` | `string` | 表示名 |

戻り値: `string`

実 API に合わせて差し替えてください。
