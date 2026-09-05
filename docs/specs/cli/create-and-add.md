# CLI: create / add

## 共通

- パッケージ: `@b4moss/hermit-crumb`
- 想定呼び出し: `npx @b4moss/hermit-crumb <command>`
- 生成パス・ファイル名は **Nuxt 慣例**および **`doc-site` の命名を踏襲**する
- 既存同名ファイルは **上書きしない**。上書きは `--force` のときのみ

## `create`（主入口）

### 目的

新規ドキュメントサイトプロジェクトを一式生成する。既存 Nuxt への後付けは初期スコープ外。

### 生成するもの

1. **シェル**
   - Nuxt アプリ骨格
   - `@b4moss/hermit-crumb` module の配線
   - `package.json` / `nuxt.config` / i18n 等の基礎設定（`doc-site` 準拠）
2. **代表ページ（content）**
   - `doc-site` 現行 content 一式（日英）
   - 例: `index` / `getting-started` / `install` / `overview` / `api` / `faq` / `tutorial` / `syntax-contrast`
3. **デフォルト UI**
   - Header（`SiteHeader` 相当）
   - Footer（`SiteFooter` 相当）
   - Sidebar（`DocsSidebar` 相当）
   - ConfigDropdown（`HeaderPrefsMenu` / `HeaderDropdown` 相当）
4. **サイト固有の置き場**
   - `site.meta.yaml`（または example からの初期ファイル）
   - ナビ設定（`app/config/docsNav.ts` 等）

### 生成後の所有

生成された UI・content・サイト固有設定は **利用側のコード**である。以降のパッケージ更新で自動上書きしない。

## `add`

### 目的

create 時に出さなかったコンポーネント等を、必要になったタイミングで利用側へ追加する。

### 振る舞い

| 条件 | 動作 |
| --- | --- |
| 対象パスにファイルが無い | テンプレートから生成 |
| 既に同名ファイルがある | スキップし、理由を表示（非ゼロ終了にするかは実装時に決定。仕様上「上書きしない」） |
| `--force` | 既存を上書きして生成 |

### 対象例（`doc-site` 由来・必要に応じて追加）

- `DocsPager`
- `DocsJsonLd`
- content 用: `FaqList` / `FaqItem` / `CollapseBox`
- その他、殻に含めず UI として切り出したもの

> create デフォルトの Header / Footer / Sidebar / ConfigDropdown も、再生成や復旧目的で `add` 対象にしてよい。その場合も上書きルールは同じ。

## 生成物の境界の明示

- README（利用側に生成する短文）および本仕様で、「触ってよい生成ファイル」と「パッケージ依存のまま」を区別する
- 専用ディレクトリや `Hc` プレフィックスによる隔離は **採用しない**（決定 12）

## 関連決定

- 決定 1, 3, 6, 12, 15 — [decisions.md](../decisions.md)

## 実装順

- Phase 4。**`create` と `add` はエージェント実装を分割**する
- CLI 骨格／`add` は Phase 3（Pico）と Multi task 可。create の UI／CSS テンプレは Pico 確定後
- 詳細: [delivery/roadmap.md](../delivery/roadmap.md)
