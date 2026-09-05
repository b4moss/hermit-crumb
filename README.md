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
- こちらがnpmパッケージ化したら、上記リポのブランチは廃止

## 配信方針
殻（共通ロジック・基盤）は npm パッケージとして配信する。利用開始は新規プロジェクトの `create` が主。見た目コンポーネントは基本 `add` で利用側に生成して所有する。

### create 時に生成するもの
- シェル（Nuxt アプリ骨格、module 接続、代表ページ）
- デフォルト UI: Header / Footer / Sidebar / ConfigDropdown
- サイト固有の置き場: `content/`、`site.meta.yaml`（値は利用側）、ナビ設定、ブランド CSS など

### パッケージに残すもの（module 経由）
- 公開 API は **Nuxt module 経由のみ**（利用側は極力直接 import しない）
- ナビ計算、JSON-LD、FAQ 抽出などの純ロジック（composables / utils）
- `site.meta.yaml` のスキーマと example（利用側は値のみ書く。スキーマ変更は semver 対象）

### CLI で追加するもの（`npx hermit-crumb add …` 想定）
- 上記デフォルト以外のコンポーネント
- 生成後は利用側のコードとして編集・カスタムする
- 既存同名ファイルは上書きしない（`--force` のときのみ上書き）

### 利用側のカスタム方針
- 深いコンポーネント継承（`extends`）より、**生成物の直接編集**または **slots / 薄いラッパ**を基本とする
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

---

以上
