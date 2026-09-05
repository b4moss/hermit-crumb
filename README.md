# hermit-crumb

Nuxt v4 ベースのテックドキュメントサイト向けシェル。npm パッケージは **`@b4moss/hermit-crumb`**（初回 **v0.1.0**）。

テックドキュメントサイトを素早く立ち上げる基盤です。自由度を残しつつナビ・i18n・メタ・JSON-LD などを揃え、スタイルは Pico.css、カラーは CSS 変数で差し替えます。

## インストール / 利用

```shell
npx @b4moss/hermit-crumb create my-docs
cd my-docs
npm install
npm run dev
```

既存プロジェクトへ module だけ入れる場合:

```shell
npm install @b4moss/hermit-crumb
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@b4moss/hermit-crumb"],
})
```

コンポーネント追加:

```shell
npx @b4moss/hermit-crumb add --list
npx @b4moss/hermit-crumb add DocsPager
```

詳細: [`packages/hermit-crumb/README.md`](./packages/hermit-crumb/README.md)、[CHANGELOG](./CHANGELOG.md)

## CD

| 対象 | トリガー | 成果 |
| --- | --- | --- |
| npm | `release` へ **新 `v*` タグ付きコミット**がマージ | `@b4moss/hermit-crumb` を publish |
| Netlify | `preview-site` へマージ | playground デモをデプロイ |

手順: [`docs/npm-publish.md`](./docs/npm-publish.md)、[`docs/netlify.md`](./docs/netlify.md)

## 方針（要約）

- 殻は Nuxt module として npm 配信（公開 API は module 経由のみ）
- 利用開始は新規 `create` が主。UI は基本 `add` で利用側に生成して所有する
- **Pico.css** + **CSS 変数**でテーマ差し替え
- `site.meta.yaml` はスキーマをパッケージ、値を利用側が持つ
- 移植元は `b4moss/git-template` の `doc-site`（[移行ガイド](./docs/migration.md)）

## リポジトリ構成

| パス | 役割 |
| --- | --- |
| [`packages/hermit-crumb`](./packages/hermit-crumb) | 公開パッケージ（module + CLI） |
| [`playground`](./playground) | create 相当のデモ（Netlify preview） |
| [`docs/specs`](./docs/specs) | 仕様の正典 |
| [`docs/migration.md`](./docs/migration.md) | 移行ガイド |
| [`docs/netlify.md`](./docs/netlify.md) | Netlify セットアップ |
| [`docs/npm-publish.md`](./docs/npm-publish.md) | npm 公開手順 |

## 開発（モノレポ）

Node.js **>= 22.19**。

```shell
npm install
npm run lint
npm run typecheck
npm run build
npm run test
npm run generate:playground
```

```shell
node packages/hermit-crumb/bin/hermit-crumb.mjs --help
```

## 仕様書

[`docs/specs/`](./docs/specs/README.md) を正とする。

- [概要](./docs/specs/overview.md)
- [ロードマップ](./docs/specs/delivery/roadmap.md)
- [CD](./docs/specs/delivery/cd.md)
- [公開条件](./docs/specs/delivery/publishing.md)
- [決定事項](./docs/specs/decisions.md)
