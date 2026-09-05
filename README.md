# hermit-crumb
Tech doc site shell with Nuxt v4

## 目的
- テックドキュメントWebサイトを高速で立ち上げるテンプレート雛形
- ある程度自由度がありつつ、テックドキュメントに必要なものが揃っている状態

## ゴール
- npmで配信すること
- previewサイトをNetlifyで配信

## 実装にあたって
- `b4moss/git-template:doc-site`を移植する
- npm パッケージ名は `@b4moss/hermit-crumb`
- `doc-site` ブランチの廃止タイミングはオーナー判断。こちらは移行ガイドを先に用意する

## 配信方針
殻（共通ロジック・基盤）は npm パッケージ `@b4moss/hermit-crumb` として配信する。利用開始は新規プロジェクトの `create` が主。見た目コンポーネントは基本 `add` で利用側に生成して所有する。

### create 時に生成するもの
- シェル（Nuxt アプリ骨格、module 接続）
- 代表ページ: `doc-site` 現行 content 一式（日英）
- デフォルト UI: Header / Footer / Sidebar / ConfigDropdown
- 生成パスは Nuxt 慣例どおり、`doc-site` の命名を踏襲（例: `app/components/SiteHeader.vue`）
- サイト固有の置き場: `content/`、`site.meta.yaml`（値は利用側）、ナビ設定など

### パッケージに残すもの（module 経由）
- 公開 API は **Nuxt module 経由のみ**（利用側は極力直接 import しない）
- ナビ計算、JSON-LD、FAQ 抽出などの純ロジック（composables / utils）
- `site.meta.yaml` のスキーマと example（利用側は値のみ書く。スキーマ変更は semver 対象）
- テーマの主契約は **CSS 変数**（利用側は変数上書きが基本）

### CLI で追加するもの（`npx @b4moss/hermit-crumb add …` 想定）
- 上記デフォルト以外のコンポーネント
- 生成後は利用側のコードとして編集・カスタムする
- 既存同名ファイルは上書きしない（`--force` のときのみ上書き）

### 利用側のカスタム方針
- 深いコンポーネント継承（`extends`）より、**生成物の直接編集**または **slots / 薄いラッパ**を基本とする
- 見た目の推奨カスタムは CSS 変数の上書き
- 触ってよい生成ファイルと、パッケージ依存のままにする境界を README / CLI で明示する
- パッケージ更新時、ロジックは `npm update`、生成 UI は必要に応じて再 add または差分適用

## 決定事項（移行・実装・npm パッケージ化）

1. **生成境界**: create = シェル＋代表ページ。コンポーネントは add。ただし Header / Footer / Sidebar / ConfigDropdown は create 時にデフォルト生成
2. **公開 API**: Nuxt module 経由のみ
3. **入口**: 新規 create 一式が主（既存 Nuxt への後付けは後回し）
4. **移植**: `doc-site` 現行機能を一括移植してから npm / CLI 化
5. **依存バージョン**: `doc-site` 現状に固定（major 追随は別判断）
6. **`add` 上書き**: 既存ファイルは上書きしない（`--force` のみ）
7. **`site.meta.yaml`**: パッケージがスキーマ＋example を提供、利用側は値のみ（スキーマは semver 対象）
8. **semver major**: 公開契約の破壊 ＋ デフォルト見た目／クラス構造の大きな変更
9. **公開先**: npmjs.com の公開パッケージ
10. **Netlify preview**: 本リポ内のデモ／サンプルサイト
11. **パッケージ名**: `@b4moss/hermit-crumb`
12. **生成パス**: Nuxt 慣例＋`doc-site` 命名を踏襲
13. **テーマ**: CSS 変数を主契約（利用側は変数上書きが基本）
14. **`doc-site` 廃止**: タイミングはオーナー判断。移行ガイドは先に用意
15. **代表ページ**: `doc-site` 現行 content 一式（日英）

---

以上
