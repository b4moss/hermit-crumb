# 公開と preview 配信

## npm 公開

| 項目 | 決定 |
| --- | --- |
| レジストリ | npmjs.com / npmjs.org |
| パッケージ名 | `@b4moss/hermit-crumb` |
| 公開範囲 | 公開パッケージ（誰でも install 可） |
| **初回公開バージョン** | **v0.1.0** |

### v0.1.0 公開条件

次を満たしたら v0.1.0 として npmjs.org に公開する。

- [overview.md](../overview.md) の「スコープ（v0.1.0）」を実装済み
- Pico.css ベース＋ CSS 変数によるカラーテーマ差し替えがデモサイトで確認できる
- `create` / `add` / module の基本経路が動作する
- 移行ガイドの初版がある

### 実装時に決める運用（仕様上の推奨）

- CI からの publish（タグ／Release 連動）。初回は `v0.1.0` タグ
- `@b4moss` scope の npm アクセス権
- 公開前の `npm pack` / デモサイトでの動作確認

## Netlify preview

| 項目 | 決定 |
| --- | --- |
| 対象 | **本リポジトリ内**のデモ／サンプルサイト |
| 目的 | パッケージ利用例そのものの preview（Pico + カラー変数の見え方含む） |
| 非対象（初期） | 別 example リポジトリ前提の preview |

デモサイトは `create` 相当の利用例として保守し、module と生成物の組み合わせが常に動作確認できる状態を目指す。

## 関連決定

- 決定 9, 10, 11, 18 — [decisions.md](../decisions.md)

## 関連文書

- 実装順: [roadmap.md](./roadmap.md)
- スコープ: [overview.md](../overview.md)
