---
# @graph: WebPage + WebSite + HowTo + SoftwareSourceCode
title: チュートリアル
description: create からオーバーライド・JSON-LD・静的生成までの手順
schemaRole: HowTo
---

# チュートリアル

ドキュメントサイトを起こし、自分用に差し替え、静的生成するまでの流れです。`schemaRole: HowTo` の見本でもあります。

## 1. スキャフォールド

```bash
npx @b4moss/hermit-crumb create my-docs
cd my-docs
npm install
```

## 2. サイトメタを入れる

```bash
cp site.meta.yaml.example site.meta.yaml
```

`siteName` / `siteUrl` / `githubUrl` / `software.*` を実値にします。Organization が必要なら `organization` ブロックを有効化します。

## 3. コンテンツとナビを整える

1. `content/{ja,en}/` の Markdown を製品向けに編集（または置き換え）
2. 必要なら `schemaRole` や `jsonLd` を付与（[JSON-LD](./json-ld.md)）
3. `app/config/docsNav.ts` と `i18n/locales/` の `nav.*` を同期
4. SSG なら `nitro.prerender.routes` にパスを追加

## 4. 見た目をオーバーライド

`app/assets/css/` に CSS を足し、Pico / hermit-crumb の CSS 変数を上書きします。コンポーネントを直したい場合は `app/components/**` を編集。テンプレに戻すときは `add --force`（[オーバーライド](./customize.md)）。

## 5. 確認して生成

```bash
npm run dev
npm run generate
```

出力は `.output/public` です。ホスト（Netlify など）へデプロイします。

## チェックリスト

- [ ] `site.meta.yaml` の URL が本番と一致
- [ ] JA/EN のページとナビが揃っている
- [ ] FAQ は `::faq-item` で書いている（FAQPage を使う場合）
- [ ] テーマは CSS 変数オーバーライドで足りているか確認
- [ ] 依存は公開 npm の `@b4moss/hermit-crumb` バージョンを指定
