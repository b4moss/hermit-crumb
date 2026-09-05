# Nuxt module 公開 API

## 原則

公開 API は **Nuxt module 経由のみ**とする。利用側は composables / utils / 内部コンポーネントパスを **極力直接 import しない**。

## module の責務

1. 依存モジュールの配線（Content / i18n / color-mode / scripts 等。`doc-site` 準拠）
2. `site.meta.yaml`（なければ example）の読み込みと `runtimeConfig.public` への正規化載せ
3. Pico.css および共通 CSS（カラー用変数デフォルト含む）の適用
4. ロジック層（ナビ、JSON-LD、FAQ 抽出等）の利用可能化（auto-import または module が公開する安定面のみ）
5. 必要ならランタイム／ビルド時ヘルパの登録

## 利用側から見て安定な契約面

| 契約 | 説明 | 破壊時 |
| --- | --- | --- |
| module オプションキー | `nuxt.config` 上の設定形状 | major |
| `runtimeConfig.public` の公開フィールド | `site.meta.yaml` 由来のサイトメタ | major（スキーマ変更に準ずる） |
| CSS 変数名 | カラーテーマ等の主契約 | major（削除・意味変更） |
| Pico.css の取り込み方 | ベーススタイルとして module が提供 | major（除去や非互換メジャー） |
| 生成テンプレの必須構造 | create / add が前提とするファイル役割 | major |

内部実装のリネームやファイル移動は、上記契約を保てば minor / patch としうる。

## 明示的に非公開とするもの

- パッケージ内部の相対パス import
- アンダースコア付き／未ドキュメントのヘルパ
- デモ専用コード

## 後回し

- 既存 Nuxt アプリへの「module だけ足す」後付けフロー（決定 3）
- ライブラリ的な名前付き export を第一級 API にすること（決定 2 で不採用）

## 関連決定

- 決定 2, 7, 8, 13 — [decisions.md](../decisions.md)
- サイトメタ詳細: [../contracts/site-meta.md](../contracts/site-meta.md)

## 実装順

- Phase 2 で module 骨格・`site.meta.yaml`・ロジック runtime を提供（Pico 適用は Phase 3）
- 詳細: [../delivery/roadmap.md](../delivery/roadmap.md)
