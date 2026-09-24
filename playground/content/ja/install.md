---
# @graph: WebPage + WebSite + TechArticle + SoftwareSourceCode
title: 導入
description: create・add・モジュールのみの導入手順
schemaRole: TechArticle
---

# 導入

導入経路は3つあります。新規サイトは `create`、既存プロジェクトへの部品追加は `add`、すでに Nuxt がある場合はモジュールのみでも使えます。

## 1. `create`（推奨）

```bash
npx @b4moss/hermit-crumb create my-docs
cd my-docs
cp site.meta.yaml.example site.meta.yaml
npm install
npm run dev
```

オプション:

| Flag | 効果 |
| --- | --- |
| `--force` | 既存ファイルを上書き |

## 2. `add`（コンポーネント追加）

Nuxt プロジェクト内（`nuxt.config.*` がある場所）で実行します。

```bash
npx @b4moss/hermit-crumb add --list
npx @b4moss/hermit-crumb add DocsPager
npx @b4moss/hermit-crumb add DocsPager --force
```

| Flag | 効果 |
| --- | --- |
| `--list` | テンプレート名と出力パスを一覧 |
| `--force` | 既存ファイルを上書き |
| `--cwd <dir>` | プロジェクトルート（既定: カレント） |

`--force` なしでは既存ファイルはスキップされます。テンプレート定義はパッケージ内 `src/cli/templates.mjs` にあります。

## 3. モジュールのみ

```bash
npm install @b4moss/hermit-crumb
```

```ts
export default defineNuxtConfig({
  modules: ["@b4moss/hermit-crumb"],
})
```

Content / i18n / color-mode / scripts の詳細設定は自分の `nuxt.config.ts` に書きます。動作例は playground の `nuxt.config.ts` を参照してください。

次は [モジュール](./module.md) でオプションとランタイム API を確認します。
