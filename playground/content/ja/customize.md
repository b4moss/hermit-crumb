---
# @graph: WebPage + WebSite + TechArticle + SoftwareSourceCode
title: オーバーライド
description: テーマ・コンポーネント・サイトメタの差し替えとパッケージ更新時の扱い
schemaRole: TechArticle
---

# オーバーライド

hermit-crumb を「自分のドキュメントサイト」にするには、生成物を編集する／CSS 変数でテーマを変える／`site.meta.yaml` を書く、の三層が中心です。パッケージ本体を fork する必要はありません。

## 1. サイトメタ（`site.meta.yaml`）

```bash
cp site.meta.yaml.example site.meta.yaml
```

解決順（先勝ち）:

1. プロジェクトの `site.meta.yaml`
2. プロジェクトの `site.meta.yaml.example`
3. パッケージ同梱の example
4. 組み込み既定値（`normalizeSiteMeta`）

主なフィールド:

| フィールド | 用途 |
| --- | --- |
| `siteName` / `siteUrl` / `siteVersion` / `description` | ブランディング・URL・フォールバック |
| `githubUrl` / `npmUrl` | ヘッダーリンク（`npmUrl` 空なら非表示） |
| `footerText` | フッター文言 |
| `software` | 全ページ共通の `SoftwareSourceCode` |
| `organization` | 任意の `Organization`（publisher） |
| `jsonLdExtra` | 全ページの `@graph` 末尾へ追加するエンティティ |

ページ役割（`TechArticle` など）は Markdown 側です。詳しくは [JSON-LD](./json-ld.md)。

## 2. テーマ（CSS 変数）

モジュールが Pico + トークンを注入したあと、**後段の CSS** で変数を上書きします。playground の `app/assets/css/theme-override.css` がその見本です。

よく触る変数:

| 変数 | 用途 |
| --- | --- |
| `--pico-primary*` | Pico プライマリ |
| `--color-accent` 系 | シェルのアクセント |
| `--color-bg` / `--color-surface` / `--color-ink` | 面・文字 |
| `--hc-max-width` / `--hc-header-height` / `--hc-sidebar-width` | レイアウト |

スタイルを自分で全部載せる場合:

```ts
hermitCrumb: {
  injectStyles: false,
}
```

## 3. UI コンポーネント

`create` / `add` で出た Vue ファイルはあなたのコードです。自由に編集できます。

テンプレートに戻したいとき:

```bash
npx @b4moss/hermit-crumb add SiteHeader --force
```

`--force` なしでは既存ファイルは触れません。パッケージ更新だけでは生成物は変わりません。

## 4. ナビと i18n

- 構造: `app/config/docsNav.ts`（`path` / `labelKey` / `parent`）
- ラベル: `i18n/locales/{ja,en}.ts` の `nav.*`
- ページ追加後は `nuxt.config.ts` の `nitro.prerender.routes` も揃える（SSG）

## 5. ランタイム設定の優先順位

| 対象 | 優先 |
| --- | --- |
| `runtimeConfig.public` | 利用側 `nuxt.config` の値がサイトメタより優先マージ |
| color-mode | 利用側オプションがモジュール既定にマージ |
| CSS | 利用側で後から読むファイルが勝つ |

## パッケージ公開との関係（メンテナ向け）

npm 上の `@b4moss/hermit-crumb` は `release` ブランチと一致する `v*` タグで公開されます。利用側サイトは **公開済みバージョンを依存に取るだけ**で、公開フロー自体を踏む必要はありません。サイトの見た目・文書・メタは常にこのページのオーバーライド経路で差し替えます。
