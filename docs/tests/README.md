# テスト仕様書

TDD の入力正本。フォーマットは憲章 [`tdd.md`](../../charter/docs/charter/tdd.md) に従う。  
実装（Vitest）は Issue **#25**。本ディレクトリは Issue **#5** の成果物。

## 方針（要約）

- **単体＋結合**: Nuxt モジュール／ランタイム／CLI のロジックを Vitest で検証する。これを本プロジェクトの「単体＋結合テスト」と呼ぶ。
- **氷山パターン**: 静的検査（lint / typecheck）で足りる単純箇所は厚く追わない。初期カバレッジ目安 **50%**。
- **E2E / ビジュアル回帰**: 当面必須としない。
- **lint**: テスト追加・仕様更新に伴う変更でも lint を通すこと。

## ドメイン分割

| ファイル | 対象ソース（主） |
| --- | --- |
| [site-meta.md](./site-meta.md) | `siteMeta.ts`, `loadSiteMeta.ts` |
| [json-ld.md](./json-ld.md) | `jsonLdEntities.ts` |
| [faq.md](./faq.md) | `extractFaq.ts` |
| [sitemap.md](./sitemap.md) | `buildSitemap.ts` |
| [composables.md](./composables.md) | `useSidebar`, `useDocsNav`, `useDocsNavAccordion`, `useJsonLd` |
| [toc.md](./toc.md) | `useDocsToc`、TOC 純関数、`DocsToc`、docs/default レイアウト（#36） |
| [cli.md](./cli.md) | `parse-args`, `templates`, `create`, `add`, CLI `run` |
| [module.md](./module.md) | `module.ts` セットアップ |

## 実装メモ（#25 向け）

- ランナー: Vitest（`@nuxt/test-utils` が必要な結合は段階導入でよい）
- 純関数（`normalizeSiteMeta`, `buildJsonLdEntity`, `extractFaqFromBody`, `parseArgs` 等）を先に単体で厚くする
- Nuxt 依存 composable はモック結合、または Nuxt テスト環境での結合に回す
- CLI は既存 `node:test` ケースを Vitest へ移植しつつ、本仕様の不足ケースを追加する

----

以上
