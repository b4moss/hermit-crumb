# composables

ランタイム composable。対象: `packages/hermit-crumb/src/runtime/composables/*.ts`。  
Nuxt 自動 import（`useState` / `useI18n` / `useRoute` 等）に依存するため、結合はモックまたは `@nuxt/test-utils` で行う。

### useSidebar

- サイドバー開閉状態を `useState` で共有する

#### テスト：正常系

- 初期 `open` は `false`
- `toggle` で `true` ↔ `false` が切り替わる
- `close` で常に `false` になる

#### テスト: 異常系

- 連続 `close` でも `false` のまま例外にならない
- 同一キーの state を共有する呼び出し間で状態が同期する（結合）

### useDocsNav

- `docsNavItems` を i18n ラベルと locale 付き `to` に写像する

#### テスト：正常系

- 各 item に `label`（`nav.{labelKey}` の翻訳）と `localePath(path)` の `to` が付く
- 元の `path` / `labelKey` 等のフィールドが保持される

#### テスト: 異常系

- ナビ設定が空のとき `items` は空配列
- 翻訳キー欠落時の振る舞い（フォールバック文字列）は i18n 設定に従い、composable 自体は例外を投げない

### useDocsPager

- 現在ルートに対する前後ページ（prev / next）を返す

#### テスト：正常系

- 先頭ページでは `prev` が `null`、`next` が次要素
- 中間ページでは前後両方がある
- 末尾ページでは `next` が `null`、`prev` が前要素
- パス末尾スラッシュの有無を正規化して一致判定する

#### テスト: 異常系

- 現在パスがナビに無いとき `prev` / `next` はともに `null`（index `-1`）
- ルートパス `/` と正規化後のナビ `to` が一致すれば index 0 として扱う

### useDocsNavAccordion

- 親ナビの開閉状態を管理し、設定に応じて localStorage へ永続化する

#### テスト：正常系

- `expandable === false` のとき `isOpen` は常に `true`、`setOpen` / `toggle` は no-op
- `expandable === true` かつ未保存時は `defaultOpen` を返す
- `setOpen` / `toggle` で `openMap` が更新される
- `persist === true` のとき client で localStorage に JSON 保存・マウント時復元される

#### テスト: 異常系

- localStorage が壊れた JSON / 非オブジェクトのとき空マップとして扱い例外にしない
- localStorage 書き込み失敗（quota 等）を握りつぶす
- `persist === false` のときストレージを読まない・書かない
- 保存値が boolean 以外のエントリは読み込み時に無視する

### useJsonLd

- ページ／サイト／ソフトウェア／Organization／ロール／extra を `@graph` にまとめ、`useHead` で JSON-LD script を出す

#### テスト：正常系

- graph に WebPage・WebSite・SoftwareSourceCode が含まれる
- organization 設定があるとき Organization が付き、WebPage 等に publisher が付く
- `schemaRole` / `jsonLd.entities` からロールエンティティが追加される
- `faqItems` がある FAQPage で Question/Answer の `mainEntity` が付く（質問テキストで重複排除）
- `jsonLdExtra` と frontmatter `extra` が sanitize 後に末尾へ付く
- `siteUrl` 末尾 `/` が実行時に除去される

#### テスト: 異常系

- FAQ の question/answer 空や重複 question は mainEntity から除外
- FAQPage で有効 Q/A が無いとき当該ロールエンティティは追加されない
- sanitize 対象外の extra は落ちる（警告）
- `schemaRole` と `entities` 競合時は entities 優先（警告）

----

以上
