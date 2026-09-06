---
# @graph: WebPage + WebSite + TechArticle + SoftwareSourceCode
title: モジュール
description: hermitCrumb オプションとランタイム（composables / utils）
schemaRole: TechArticle
---

# モジュール

エントリは `@b4moss/hermit-crumb`（`packages/hermit-crumb/src/module.ts`）です。公開面は **Nuxt モジュール**のみ。composables / utils は auto-import を使い、パッケージ内部を deep-import しないでください。

## オプション（`hermitCrumb`）

```ts
export default defineNuxtConfig({
  modules: ["@b4moss/hermit-crumb"],
  hermitCrumb: {
    installDeps: true,  // Content / i18n / color-mode / scripts を導入
    injectStyles: true, // Pico.css + tokens.css を注入
  },
})
```

| オプション | 既定 | 挙動 |
| --- | --- | --- |
| `installDeps` | `true` | ピアモジュールを `installModule` |
| `injectStyles` | `true` | Pico と `runtime/styles/tokens.css` を `css` 先頭へ |

## モジュールがすること

1. `site.meta.yaml` を読み、`runtimeConfig.public` にマージ（**利用側の値が優先**）
2. 未設定なら `i18n.baseUrl` を `siteUrl` から設定
3. `@nuxtjs/color-mode` を Pico（`dataValue: "theme"` など）に合わせる（利用側オーバーライド可）
4. 依存導入・スタイル注入（オプション）
5. `runtime/composables` と `runtime/utils` を auto-import 登録

## ランタイム（auto-import）

Composables:

| 名前 | 役割 |
| --- | --- |
| `useDocsNav` / `useDocsPager` | `~/config/docsNav` からナビと前後ページ |
| `useDocsNavAccordion` | アコーディオン開閉（localStorage） |
| `useJsonLd` | ページ用 JSON-LD `@graph` |
| `useSidebar` | モバイルサイドバー状態 |

Utils（サーバでも利用可）:

| 名前 | 役割 |
| --- | --- |
| `normalizeSiteMeta` など | サイトメタ正規化 |
| sitemap 系ヘルパー | パス組み立て |
| `extractFaq` | FAQ Q/A 抽出（JSON-LD 用） |
| `jsonLdEntities` 系 | WebPage / Organization / software ノード |

## `runtimeConfig.public`（サイトメタ由来）

`siteName`、`siteUrl`、`siteVersion`、`description`、`githubUrl`、`npmUrl`、`footerText`、`software`、`organization`、`jsonLdExtra`。

メタのフィールド詳細は [オーバーライド](./customize.md) の `site.meta.yaml` 節、JSON-LD は [JSON-LD](./json-ld.md) を参照してください。
