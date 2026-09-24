# hermit-crumb

Nuxt v4 向け技術ドキュメントサイト用シェル。公開パッケージは **`@b4moss/hermit-crumb`**（Nuxt モジュール＋CLI）。

## スコープ

- モジュール: サイトメタ読込、依存モジュール導入、スタイル注入、composables / utils の auto-import
- CLI: `create`（スキャフォールド）と `add`（UI コンポーネント追加）
- ランタイム: ナビ、サイドバー、JSON-LD、FAQ 抽出、sitemap 生成などドキュメントシェル用ロジック

## 技術方針

- Node.js `>= 24.20`
- 憲章: submodule [`charter/`](../charter/README.md)（詳細は [`override-charter.md`](./override-charter.md)）
- TDD: [氷山パターン](../charter/docs/charter/tdd.md)。単体＋結合は Vitest（仕様は [`tests/`](./tests/README.md)、実装は Issue #25）
- 初期カバレッジ目標: 50%

## ドキュメント索引

| 種別 | 場所 |
| --- | --- |
| 利用・API | [README](./README.md)（`usage.md` 等） |
| 憲章 | [`charter/docs/charter/`](../charter/docs/charter/README.md) |
| 憲章オーバーライド | [override-charter.md](./override-charter.md) |
| テスト仕様 | [tests/README.md](./tests/README.md) |

----

以上
