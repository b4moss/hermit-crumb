# `doc-site` から hermit-crumb への移行ガイド

`b4moss/git-template` の `doc-site` ブランチから、`@b4moss/hermit-crumb` への乗り換え手順の初版です。

仕様上の移植方針は [`docs/specs/delivery/migration.md`](./specs/delivery/migration.md) を正とします。**`doc-site` ブランチの廃止タイミングはオーナー判断**であり、本ガイドは廃止操作を含みません（決定 14）。

## 何が変わるか

| 以前（`doc-site`） | いま（hermit-crumb） |
| --- | --- |
| テンプレリポを直接複製 | npm の `@b4moss/hermit-crumb`（module + CLI） |
| 独自 CSS 中心 | **Pico.css** + **CSS 変数**でカラー差し替え |
| 殻と UI が一体 | 殻ロジックは module、UI は `create` / `add` で利用側所有 |

参照実装: 本リポの [`playground/`](../playground/README.md)（create 相当 + カラー上書きデモ）。

## 新規サイト（推奨）

```shell
npx @b4moss/hermit-crumb create my-docs
cd my-docs
cp site.meta.yaml.example site.meta.yaml   # 任意
npm install
npm run dev
```

生成物（UI・content・`site.meta.yaml`・ナビ設定など）は **利用側所有**です。パッケージ更新では自動上書きしません。追加や復旧は:

```shell
npx @b4moss/hermit-crumb add --list
npx @b4moss/hermit-crumb add DocsPager
# 既存を置き換えるときだけ
npx @b4moss/hermit-crumb add DocsPager --force
```

## 所有境界

| パッケージ依存のまま | 利用側が触る（生成・保守） |
| --- | --- |
| Nuxt module（`@b4moss/hermit-crumb`） | `app/components/**`（Header / Footer / Sidebar 等） |
| Pico.css / デフォルト CSS 変数 | `content/{ja,en}/**` |
| composables / utils（auto-import） | `site.meta.yaml` の値 |
| `site.meta.yaml` のスキーマ・example | `app/config/docsNav.ts`、上書き CSS |

詳細: [`docs/specs/architecture/distribution.md`](./specs/architecture/distribution.md)

## `site.meta.yaml`

1. `site.meta.yaml.example` を `site.meta.yaml` にコピーする（無くても example がフォールバック）
2. `siteName` / `siteUrl` / GitHub・npm URL などをサイト向けに編集する
3. Markdown frontmatter にサイト共通の SoftwareSourceCode を書かない（YAML 側）

契約: [`docs/specs/contracts/site-meta.md`](./specs/contracts/site-meta.md)

## カラー（CSS 変数）

コンポーネントを編集せず、`:root` / `[data-theme]` で変数を上書きします。playground の例:

[`playground/app/assets/css/theme-override.css`](../playground/app/assets/css/theme-override.css)

仕様: [`docs/specs/architecture/theming.md`](./specs/architecture/theming.md)

## content / i18n

- 日英 Markdown は利用側の `content/` に置く（create が代表ページ一式を出す）
- i18n locales・ナビ（`docsNav`）も利用側
- FAQ など Content コンポーネントは create に同梱。後から足す場合は `add`

## 既存 `doc-site` からの移植メモ

完全自動マイグレーションは提供しません。手作業の目安:

1. 新規に `create` で骨格を出す（または playground 構成を参考に module を配線する）
2. `content/` を移す（パス・frontmatter・`schemaRole` を確認）
3. `site.meta.yaml` を埋め直す
4. カスタム UI 差分だけ生成コンポーネントへ手移植する（深い `extends` は非推奨）
5. 独自 CSS を Pico + CSS 変数上書きへ寄せる

依存バージョンは [`docs/specs/contracts/versioning.md`](./specs/contracts/versioning.md) に合わせる。

## 次のステップ（リポ側）

- Netlify preview: `preview-site` へのマージでデプロイ（Phase 5B / [cd.md](./specs/delivery/cd.md)）
- npm 公開: `release` + タグ（Phase 6 / [publishing.md](./specs/delivery/publishing.md)）
