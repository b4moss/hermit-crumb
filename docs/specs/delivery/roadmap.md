# ロードマップ（〜 v0.1.0）

v0.1.0 実現までのフェーズ分けとタスク分解。詳細要件の正は各仕様書、本文書は実装順とエージェント投入の案内とする。

## 依存関係

```
Phase 0 基盤
    ↓
Phase 1 doc-site 一括移植
    ↓
Phase 2 殻の module 化
    ↓
Phase 3 Pico.css + カラー変数 ──┐
    ↓                          │（create テンプレ見た目は Pico 確定後）
Phase 4 CLI（create / add）←───┘
    ↓
Phase 5 デモ・Netlify・移行ガイド
    ↓
Phase 6 v0.1.0 公開
```

## エージェント実装・Multi task 方針

1 回のエージェント実装に任せられる粒度と、Multi task（並行トラック）してよい境界を定める。

### 1 エージェント実装の推奨単位

| Phase | 推奨単位 | 目安 |
| --- | --- | --- |
| 0 | リポ骨格一式 | 1 セッションで完了しやすい |
| 1 | `doc-site` 取り込み〜`dev` / `generate` | 「動く移植」で完了条件が明確 |
| 2 | module 骨格＋`site.meta`＋ロジック寄せ | **Phase 2 全体を 1 本**が上限感。設計が重い |
| 3 | Pico 導入＋変数＋デモ見た目 | UI/CSS に閉じる 1 本 |
| 4 | **`create` と `add` を別セッションに分割** | まとめると大きすぎる |
| 5 | デモ整備 / Netlify / 移行ガイドを **各 1 本** | 成果物が配線・文書中心 |
| 6 | 公開チェック＋ publish | 短い（npm 権限前提） |

### Multi task（並行）してよいところ

依存を跨がないものだけ並行する。

| タイミング | Track A | Track B | 合流条件 |
| --- | --- | --- | --- |
| Phase 0 内 | `package.json`／ライセンス等 | CI 骨格 | 両方マージ後に Phase 1 |
| Phase 2 **完了後** | **Phase 3**（Pico＋カラー変数＋デモ見た目） | **Phase 4 前半**（CLI 骨格・`add` の非上書き・`--force`・ヘルプ） | create が吐く UI／CSS テンプレは **Phase 3 後**に確定 |
| Phase 3 完了後の Phase 4 内 | `create` の content／デフォルト UI 生成 | `add` テンプレ追加 | 生成ファイルが被らないこと |
| Phase 5 内 | 移行ガイド執筆 | Netlify 配線 | デモの置き場が決まっていること |

### おすすめの Multi task 塊

1. **Track A**: Phase 3（Pico＋カラー変数＋デモ見た目）
2. **Track B**: Phase 4 前半（CLI 骨格・`add` 非上書き・`--force`）
3. 合流後: **create テンプレ最終化**（Phase 4 後半）
4. Phase 5: **移行ガイド ‖ Netlify**

一番おいしい並行は **「Phase 3 ‖ Phase 4 CLI 骨格」** と **「Phase 5 の文書 ‖ Netlify」**。

### 並行してはいけないもの

| 組み合わせ | 理由 |
| --- | --- |
| Phase 1 ‖ Phase 2 | 同じツリーを奪い合う |
| Phase 2 ‖ Phase 3 | CSS／スタイルの置き場が module 側に寄る途中 |
| Pico 未完了 ‖ create テンプレ確定 | 見た目コンフリクト |

## Phase 0 — リポジトリ基盤

**エージェント**: 1 セッション想定。Multi task 可（0.2 ‖ 0.3）。

| ID | タスク | 完了条件（目安） |
| --- | --- | --- |
| 0.1 | パッケージ配置の決定（例: `packages/hermit-crumb` + デモ／playground） | ディレクトリ構成が README／仕様と一致 |
| 0.2 | `@b4moss/hermit-crumb` の `package.json`・ライセンス・基本メタ | install 可能な骨格がある |
| 0.3 | 基本 CI（lint / typecheck / build の受け皿） | main 向けに最低限のチェックが走る |
| 0.4 | 仕様書を正として維持する運用を確認 | 実装差分時は `docs/specs` を更新する前提が共有されている |

## Phase 1 — `doc-site` 一括移植

**エージェント**: 1 セッション想定。他 Phase と並行しない。

| ID | タスク | 完了条件（目安） |
| --- | --- | --- |
| 1.1 | `b4moss/git-template:doc-site` を作業ツリーへ取り込む | アプリとしてリポジトリ内で動く |
| 1.2 | Nuxt / Content / i18n / color-mode / scripts を現状版で固定 | `package.json` が仕様の固定方針と一致 |
| 1.3 | `dev` / `generate` が通ることを確認 | ローカルでドキュメントサイトが閲覧・SSG 可能 |

関連: [migration.md](./migration.md)、決定 4・5

## Phase 2 — 殻の module 化

**エージェント**: 1 セッション上限（分割するなら 2.1–2.2 と 2.3–2.4）。Phase 3 と並行しない。

| ID | タスク | 完了条件（目安） |
| --- | --- | --- |
| 2.1 | Nuxt module 骨格を作成（公開 API は module のみ） | デモが `modules: ['@b4moss/hermit-crumb']` 相当で動く |
| 2.2 | `site.meta.yaml` 読込 → 正規化 → `runtimeConfig.public` | example フォールバック含む |
| 2.3 | ロジック層の切り出し（ナビ、JSON-LD、FAQ 抽出等） | 利用側が内部パスを直 import しなくてよい |
| 2.4 | 移植アプリを「module 利用側」に寄せる | 殻ロジックがパッケージ側に寄っている |

関連: [module-api.md](../architecture/module-api.md)、[site-meta.md](../contracts/site-meta.md)、決定 2・7

## Phase 3 — Pico.css + カラー変数

**エージェント**: 1 セッション想定。Phase 2 完了後、Phase 4 CLI 骨格と Multi task 可。

| ID | タスク | 完了条件（目安） |
| --- | --- | --- |
| 3.1 | Pico.css を依存追加し、module 経由でベース適用 | デモが Pico ベースで描画される |
| 3.2 | カラー用 CSS 変数のデフォルト（ライト／ダーク）を定義 | color-mode と連携して切り替わる |
| 3.3 | 既存 UI を Pico＋変数前提に寄せる | 大きな崩れ・コントラスト破綻がない |
| 3.4 | 変数上書きだけでサイトカラーが変わることを確認 | デモまたはドキュメントで手順が示せる |

関連: [theming.md](../architecture/theming.md)、決定 13・16・17

## Phase 4 — CLI（`create` / `add`）

**エージェント**: **2 セッションに分割**（4A 骨格／`add`、4B `create` テンプレ最終化）。  
4A は Phase 3 と Multi task 可。4B は Phase 3 完了後。

| ID | タスク | セッション | 完了条件（目安） |
| --- | --- | --- | --- |
| 4.1 | CLI 骨格・ヘルプ・`add` の非上書き／`--force` | 4A | 既存ファイルを誤って上書きしない |
| 4.2 | `add`: その他コンポーネントのテンプレ追加 | 4A（または 4B と並行可※） | 必要コンポーネントを追加できる |
| 4.3 | `create`: シェル＋代表 content 一式（日英） | 4B | `doc-site` 現行 content 相当が出る |
| 4.4 | `create`: Header / Footer / Sidebar / ConfigDropdown | 4B | 命名は `doc-site` 踏襲、Pico 前提の見た目 |
| 4.5 | 通し確認: `create` → install → `dev` | 4B | 新規ディレクトリでドキュメントサイトが立ち上がる |

※ 4.2 と 4.3–4.4 は、生成ファイルが被らなければ Phase 3 後に並行可。

関連: [create-and-add.md](../cli/create-and-add.md)、[distribution.md](../architecture/distribution.md)、決定 1・3・6・12・15

## Phase 5 — デモ・Netlify・移行ガイド

**エージェント**: 最大 3 セッション（5.1 → その後 5.2 ‖ 5.3）。

| ID | タスク | 完了条件（目安） |
| --- | --- | --- |
| 5.1 | 本リポ内デモを `create` 相当の利用例として整える | module + 生成物 + Pico が見える |
| 5.2 | Netlify preview を配線 | preview URL でデモが閲覧できる |
| 5.3 | `doc-site` → hermit-crumb 移行ガイド初版 | `docs/` 配下に初版がある（廃止操作はオーナー判断） |

5.1 完了後、**5.2 ‖ 5.3** を Multi task してよい。

関連: [publishing.md](./publishing.md)、[migration.md](./migration.md)、決定 10・14

## Phase 6 — v0.1.0 公開

**エージェント**: 1 セッション想定（権限・シークレットは人間側前提）。

| ID | タスク | 完了条件（目安） |
| --- | --- | --- |
| 6.1 | [publishing.md](./publishing.md) の v0.1.0 公開条件をチェック | 未達項目がゼロ |
| 6.2 | `v0.1.0` タグを打つ | タグがリポジトリに存在する |
| 6.3 | npmjs.org に `@b4moss/hermit-crumb@0.1.0` を公開 | `npm view` で確認できる |
| 6.4 | README／changelog を公開内容に合わせて最終化 | インストール手順が実パッケージと一致 |

関連: 決定 9・11・18、[overview.md](../overview.md)

## ボリューム感（領域ベース）

| Phase | 主な塊 |
| --- | --- |
| 0 | 設定・骨格（比較的小さい） |
| 1 | `doc-site` ほぼ全体の取り込み |
| 2 | module 境界の切り直し（設計が最も重い） |
| 3 | CSS／コンポーネント見た目 |
| 4 | CLI＋テンプレート一式（分割推奨） |
| 5–6 | 配線・文書・公開手順 |

## 関連文書

- [overview.md](../overview.md) — v0.1.0 スコープ
- [publishing.md](./publishing.md) — 公開条件
- [decisions.md](../decisions.md) — 決定 1–18
