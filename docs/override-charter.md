# このプロジェクト独自のルール（憲章をオーバーライドする範囲）

憲章の正本は Git submodule `charter/`（`b4moss/charter` の `docs` ブランチ）に置く。  
参照パスは `charter/docs/charter/`（例: [tdd.md](../charter/docs/charter/tdd.md)）。

憲章リポジトリをリポジトリルートへ merge していないため、`docs/charter/` には展開しない。これが本プロジェクトの憲章配置のオーバーライドである。

## テストランナー

- 単体＋結合テストの実装ランナーは **Vitest** とする（Issue #5 / #25）。
- 既存の `node:test` による CLI テストは、Vitest 移行までの過渡として残してよい。移行後は Vitest に統一する。

## カバレッジ

- 氷山パターンに従い、初期目標は **50%**（`packages/hermit-crumb` の対象ロジック）。
- 過剰なカバレッジ追求は初期リリースではしない。

## 薄い DDD

- 本パッケージは Nuxt モジュール＋CLI であり、DB CRUD を持たない。
- 憲章どおり、CRUD Trait / Repository 層の必須適用はしない。

## docs ルート

- 既存の利用ドキュメント（`usage.md` / `module.md` 等）は `docs/` 直下に残す。
- 憲章の「ルートはハブのみ」は、プロダクト利用ドキュメントを直下に置く本構成を優先する。
- プロダクト目的のハブは [`main.md`](./main.md)。テスト仕様は [`tests/`](./tests/README.md)。

-----

以上
