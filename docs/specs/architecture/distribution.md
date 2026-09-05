# 配信モデルと所有境界

## 方針サマリ

殻（共通ロジック・基盤）は npm パッケージ `@b4moss/hermit-crumb` として配信する。利用開始は **新規プロジェクトの `create` が主**。見た目コンポーネントは基本 **`add` で利用側に生成して所有**する。

```
┌─────────────────────────────────────────────┐
│  @b4moss/hermit-crumb (npm)                 │
│  - Nuxt module                              │
│  - composables / utils（ロジック）            │
│  - site.meta スキーマ・example               │
│  - CSS 変数のデフォルト定義                   │
│  - create / add 用テンプレート               │
└──────────────────┬──────────────────────────┘
                   │ create / add / npm update
                   ▼
┌─────────────────────────────────────────────┐
│  利用側プロジェクト（所有）                    │
│  - 生成 UI（Header 等）                       │
│  - content/（日英 Markdown）                  │
│  - site.meta.yaml（値）                       │
│  - docsNav 等のサイト固有設定                 │
└─────────────────────────────────────────────┘
```

## 所有境界

### パッケージ側（常に module / 依存として提供）

| 種別 | 例 | 利用側の扱い |
| --- | --- | --- |
| Nuxt module | 自動登録・設定取り込み | `nuxt.config` で modules に追加（create が配線） |
| 純ロジック | ナビ計算、JSON-LD、FAQ 抽出 | 直接 import せず module 経由で使う |
| 契約 | `site.meta.yaml` スキーマ、CSS 変数名 | 値／上書きのみ |
| CLI テンプレ | create / add の雛形 | 生成後は利用側所有 |

### create 時に利用側へ生成（デフォルト）

| 種別 | 内容 |
| --- | --- |
| シェル | Nuxt アプリ骨格、module 接続、設定ファイル一式 |
| 代表ページ | `doc-site` 現行 `content/{ja,en}/` 一式 |
| デフォルト UI | Header / Footer / Sidebar / ConfigDropdown |
| サイト固有置き場 | `site.meta.yaml`（または example からコピー）、ナビ設定など |

> **命名メモ**: `doc-site` 上の実体は `SiteHeader.vue` / `SiteFooter.vue` / `DocsSidebar.vue` / `HeaderPrefsMenu.vue`（および `HeaderDropdown.vue`）など。仕様上の「ConfigDropdown」は設定・表示系ドロップダウン（言語・カラーモード等）を指し、実装名は `doc-site` 踏襲を優先する。

### add で利用側へ追加

- 上記デフォルト以外のコンポーネント（例: `DocsPager`、`FaqList` / `FaqItem`、`CollapseBox`、`DocsJsonLd` など、必要になったもの）
- 生成後は利用側コードとして編集・カスタムする
- 上流パッケージ更新では **自動上書きしない**

### 利用側に残す／利用側が保守するもの

- `content/`
- `site.meta.yaml` の値
- ナビ設定（`app/config/docsNav.ts` 等）
- ロゴ、GTM ID、ブランド固有の上書き CSS
- create / add で生成した UI コンポーネント

## カスタム方針

| 推奨 | 非推奨 |
| --- | --- |
| 生成物の直接編集 | 深い `extends` による継承カスタム |
| slots / 薄いラッパ | パッケージ内部パスの直接 import |
| CSS 変数の上書き | クラス構造を前提にした脆弱な上書き（major 対象になり得る） |

## 更新時の期待動作

| 対象 | 更新手段 |
| --- | --- |
| ロジック・module・スキーマ | `npm update @b4moss/hermit-crumb` |
| 生成 UI | 必要に応じて再 `add`（`--force`）または手作業の差分適用 |
| content / サイト固有設定 | 利用側が独自に保守 |

## 関連決定

- 決定 1, 2, 3, 11, 12, 15 — [decisions.md](../decisions.md)
