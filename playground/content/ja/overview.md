---
# @graph: WebPage + WebSite + TechArticle + SoftwareSourceCode
title: 概要
description: hermit-crumb の構成・所有権・何がパッケージに残るか
schemaRole: TechArticle
---

# 概要

hermit-crumb は「ドキュメントシェル」です。シェルの振る舞い（メタ読込、依存モジュール導入、スタイル注入、composables / utils の auto-import）はパッケージが持ち、見た目と文書は利用側が持ちます。

## 構成

| 部品 | 役割 |
| --- | --- |
| Nuxt モジュール `@b4moss/hermit-crumb` | `site.meta.yaml` 読込、Content / i18n / color-mode / scripts の導入、Pico + トークン注入、ランタイム auto-import |
| CLI `create` | ドキュメントサイト一式をスキャフォールド |
| CLI `add` | UI コンポーネントを個別追加・復元（`--force` で上書き） |
| ランタイム | ナビ、サイドバー、JSON-LD、FAQ 抽出、sitemap など |

## 所有権（重要）

| パッケージ側に残る | `create` / `add` 後はあなたのもの |
| --- | --- |
| Nuxt モジュール、Pico + 既定トークン | `app/components/**` |
| auto-import される composables / utils | `content/**`、`app/config/docsNav.ts` |
| `site.meta.yaml` の形と example | `site.meta.yaml` の値、オーバーライド CSS |

パッケージを更新しても、生成済みファイルは書き換えられません。UI を最新テンプレートに戻したいときだけ `npx @b4moss/hermit-crumb add <Name> --force` を使います。

## 技術前提

- Node.js `>= 24.20`
- Nuxt `^4.5.2`（モジュール互換は `>=4.5.0`）
- ピア: `@nuxt/content`、`@nuxtjs/i18n`、`@nuxtjs/color-mode`、`@nuxt/scripts`（`installDeps: true` ならモジュールが導入）

詳細なオプションは [モジュール](./module.md)、差し替え手順は [オーバーライド](./customize.md) を参照してください。
