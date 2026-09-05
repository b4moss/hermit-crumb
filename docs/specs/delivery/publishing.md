# 公開と preview 配信

## npm 公開

| 項目 | 決定 |
| --- | --- |
| レジストリ | npmjs.com / npmjs.org |
| パッケージ名 | `@b4moss/hermit-crumb` |
| 公開範囲 | 公開パッケージ（誰でも install 可） |
| **初回公開バージョン** | **v0.1.0** |
| **CD** | **`release` ブランチ**に、**新しいタグ付きコミット**がマージされたら npm リリース |

### v0.1.0 公開条件

次を満たしたら v0.1.0 として npmjs.org に公開する。

- [overview.md](../overview.md) の「スコープ（v0.1.0）」を実装済み
- Pico.css ベース＋ CSS 変数によるカラーテーマ差し替えがデモサイトで確認できる
- `create` / `add` / module の基本経路が動作する
- 移行ガイドの初版がある
- [cd.md](./cd.md) の npm CD が配線済みで、`release` + タグ経路で公開できる

### 公開の出し方（v0.1.0）

1. 公開条件を満たしたコミットに `v0.1.0` タグを付与する
2. そのコミットを `release` ブランチへマージする
3. CD が `@b4moss/hermit-crumb@0.1.0` を npmjs.org に publish する

手動 `npm publish` は緊急時の退避とし、通常経路は CD とする。

## Netlify preview

| 項目 | 決定 |
| --- | --- |
| 対象 | **本リポジトリ内**のデモ／サンプルサイト |
| 目的 | パッケージ利用例そのものの preview（Pico + カラー変数の見え方含む） |
| 非対象（初期） | 別 example リポジトリ前提の preview |
| **CD** | **`preview-site` ブランチ**へのマージで Netlify リリース |

デモサイトは `create` 相当の利用例として保守し、module と生成物の組み合わせが常に動作確認できる状態を目指す。更新は `preview-site` へマージして CD で出す。セットアップ手順は [docs/netlify.md](../../netlify.md)。

## 関連決定

- 決定 9, 10, 11, 18, 19, 20 — [decisions.md](../decisions.md)

## 関連文書

- CD 詳細: [cd.md](./cd.md)
- Netlify 手順: [docs/netlify.md](../../netlify.md)
- 実装順・エージェント／Multi task: [roadmap.md](./roadmap.md)
- スコープ: [overview.md](../overview.md)
