---
# @graph: WebPage + WebSite + SoftwareSourceCode（schemaRole なし）
# 書く場所: site.meta.yaml（共通）/ title・description（このページ）
# 詳細: docs/jsonld_ja.md
title: ホーム
description: Nuxt Content ドキュメントサイトのスキャフォールド
---

# Doc Site

このブランチは、Nuxt Content ベースのドキュメントサイト雛形です。

## 次のステップ

1. `site.meta.yaml.example` を `site.meta.yaml` にコピーしてサイト変数を設定する
2. `app/config/docsNav.ts` でサイドバー／ページャーのナビを編集する
3. `content/{ja,en}/` に Markdown を追加する（必要なら `schemaRole`）
4. `i18n/locales/` の `nav.*` ラベルを揃える

## JSON-LD ダミーページ（#40）— 何を書くと何が出るか

| ページ | 書く場所の要点 | 出る `@graph` |
| --- | --- | --- |
| このページ（トップ） | `schemaRole` なし + `site.meta.yaml` | WebPage + SoftwareSourceCode |
| [概要](./overview.md) | `schemaRole: TechArticle` | WebPage + TechArticle + SoftwareSourceCode |
| [インストール](./install.md) | `schemaRole: TechArticle` | 同上 |
| [API](./api.md) | `jsonLd`（詳細記法） | WebPage + TechArticle + BreadcrumbList + … |
| [チュートリアル](./tutorial.md) | `schemaRole: HowTo` | WebPage + HowTo + SoftwareSourceCode |
| [FAQ](./faq.md) | `schemaRole: FAQPage` + `::faq-item` | WebPage + FAQPage + SoftwareSourceCode |

詳しくは [はじめに](./getting-started.md) とリポジトリの `docs/jsonld_ja.md` を参照してください。
