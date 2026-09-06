# toc

TOC（目次）とスクロールスパイ。Issue **#36**。  
対象（予定）:

- `packages/hermit-crumb/src/runtime/composables/useDocsToc.ts`（および TOC 用の純関数）
- `packages/hermit-crumb/templates/add/DocsToc.vue`
- `packages/hermit-crumb/templates/create/app/layouts/docs.vue`
- `packages/hermit-crumb/templates/create/app/layouts/default.vue`
- `packages/hermit-crumb/templates/create/app/pages/[...slug].vue`
- CLI 登録: `templates.mjs` の `DocsToc`

方針:

- **単体で厚くする**: depth 正規化・TOC リンクの depth フィルタ・active id 決定など純ロジック
- **結合**: Nuxt 依存（`useState` / inject / `IntersectionObserver`）はモックまたは `@nuxt/test-utils`
- **E2E / ビジュアル**: 当面必須としない。レイアウト表示・sticky・モバイル非表示は手動確認項目に回す

### normalizeTocDepth（純関数・予定）

- TOC に含める最大見出しレベルを `1`〜`6` に正規化する
- コンポーネント props `depth`（デフォルト `3`）の入力ガードに使う

#### テスト：正常系

- `1`〜`6` の整数はそのまま返す
- 省略時（`undefined` / 未指定相当）は `3`

#### テスト: 異常系

- `0` 以下・`7` 以上はデフォルト `3` にフォールバックする（または最も近い境界にクランプする。実装は一方に固定しテストで固定値を明示）
- 非数（`NaN` / 文字列 / `null`）は `3`
- 小数は整数へ切り捨てたうえで上記規則を適用する（例: `3.9` → `3`）

### filterTocLinks（純関数・予定）

- Nuxt Content の `body.toc.links`（`id` / `depth` / `text` / `children`）を、指定 depth 以下に絞り込む
- ネストした `children` も同じ depth 規則で再帰フィルタする

#### テスト：正常系

- `depth: 3` のとき `depth <= 3` のリンクのみ残る
- `depth: 1` のとき h1 相当のみ
- `depth: 6` のとき渡されたリンクを実質すべて残す
- 親が残り子が閾値超のとき、親は残り `children` は空配列または省略（実装を一方に固定）
- 元の `id` / `text` / `depth` を破壊しない（新しい配列・ノードを返す）

#### テスト: 異常系

- `links` が `undefined` / `null` / 非配列のとき空配列
- `children` 欠落のノードでも例外にしない
- `depth` 欠落のリンクは含めない（または depth `0` 扱いで除外。実装を固定）
- 空の `text` / `id` のリンクは結果に含めない

### resolveActiveTocId（純関数・予定）

- 交差中の見出し id 集合と見出し出現順から、TOC でハイライトする 1 件の id を決める

#### テスト：正常系

- 交差中が 1 件ならその id
- 複数交差時はドキュメント順で最も上（または最も「現在セクション」として採用する規則。実装を一方に固定しテストで明示）の id
- 交差が空のときは、直近に通過した見出し id を維持する入力がある場合それを返す

#### テスト: 異常系

- 既知見出し一覧に無い id は無視する
- 空の交差かつ履歴無しのとき `null` / `undefined`
- 見出し順一覧が空のとき `null`

### useDocsToc

- TOC リンクの取得・depth フィルタ・スクロールスパイ用の active id を提供する
- 入力は provide/inject された toc、または引数で渡した links を想定
- client で `IntersectionObserver` を見出し要素に張り、アンマウントで disconnect する

#### テスト：正常系

- 初期 `depth` 未指定は `3` 相当でフィルタされる
- `depth` を `2` にするとフィルタ結果が変わる
- `links` 空のとき表示用リストは空、observer は張らない（または対象 0 件）
- observer コールバックで交差が変わると `activeId` が更新される
- `onBeforeUnmount`（または同等）で observer が disconnect される
- ルート変更時に監視対象・`activeId` が新しいページの見出しに付け直される（結合）

#### テスト: 異常系

- `document.getElementById` が取れない id は監視対象から外し例外にしない
- SSR / `import.meta.server` では observer を作らない
- `IntersectionObserver` 非存在環境では spy をスキップし例外にしない（フォールバックは active 無しでよい）

### DocsToc（コンポーネントテンプレート）

- `templates/add/DocsToc.vue` → 生成先 `app/components/DocsToc.vue`
- props: `depth`（`1`〜`6`、デフォルト `3`）。必要なら `links` も受けられること
- docs レイアウトに既定配置。拡張可能な add コンポーネントとして単体でも使えること

#### テスト：正常系

- `depth` デフォルトが `3`（props 定義または正規化経由）
- フィルタ後リンクを一覧レンダーし、各項目が `#id` へ遷移する `href` を持つ
- `activeId` と一致する項目にアクティブ用のクラス / `aria-current` 等が付く
- リンク 0 件のときナビを出さない（または空レンダー。実装を固定）

#### テスト: 異常系

- 不正な `depth` props でも例外なくデフォルト相当で描画できる
- inject / props の toc が無いとき空表示で例外にしない

### layouts（docs / default）とページ接続

- `layouts/docs.vue`: `SiteHeader` + `DocsSidebar` + main slot + `SiteFooter`
- ドキュメントページ（`[...slug].vue`）内に `DocsToc` をデフォルト配置（右 TOC は PC 想定）
- `layouts/default.vue`: `SiteHeader` + main + `SiteFooter`（Sidebar / TOC なし）
- `pages/[...slug].vue`: `definePageMeta({ layout: "docs" })` を既定とし、toc を layout / DocsToc へ提供する

#### テスト：正常系

- create 成果物に `app/layouts/docs.vue` と `app/layouts/default.vue` が含まれる
- create 成果物の `[...slug].vue` が docs レイアウトを指定している
- create / add で `app/components/DocsToc.vue` が生成される
- docs レイアウトに `DocsSidebar` が含まれる（スキャフォールド文字列アサーションで可）
- ドキュメントページに `DocsToc` が含まれる
- default レイアウトに `DocsSidebar` / `DocsToc` が含まれない

#### テスト: 異常系

- 既存プロジェクトで `add DocsToc` のみ実行してもテンプレートはコピーされ、レイアウト未変更でもコマンドは成功する（利用側が手動配置する拡張パス）

### CLI 登録（ADD_TEMPLATES 追記分）

- `findTemplate("DocsToc")` が `app/components/DocsToc.vue` を返す（大文字小文字無視）
- `add DocsToc` 初回は `created`、既存非 force は `skipped`、`--force` は `overwritten`
- create のデフォルト UI 一式に DocsToc が含まれる

#### テスト：正常系

- 計画済み名前一覧に `DocsToc` が含まれる（`cli.md` の一覧テストと同期して更新）

#### テスト: 異常系

- 未登録名と同様、typo は `UNKNOWN_COMPONENT`

### 手動確認（E2E 必須としない）

実装後・PR 前の確認用。自動テスト化は後回しでよい。

- PC（幅 ≥ 900px）: メインコンテンツ右に TOC が出て、ヘッダー下で sticky 追従する
- モバイル（幅 < 900px）: TOC が非表示
- スクロールで現在段落（見出しセクション）に対応する TOC 項目がハイライトされる
- TOC クリックで該当見出しへ移動し、sticky header に隠れない（`scroll-margin-top` 等）
- `depth` を変えると TOC の階層が変わる

----

以上
