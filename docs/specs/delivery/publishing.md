# 公開と preview 配信

## npm 公開

| 項目 | 決定 |
| --- | --- |
| レジストリ | npmjs.com |
| パッケージ名 | `@b4moss/hermit-crumb` |
| 公開範囲 | 公開パッケージ（誰でも install 可） |

### 実装時に決める運用（仕様上の推奨）

- CI からの publish（タグ／Release 連動）
- `@b4moss` scope の npm アクセス権
- 公開前の `npm pack` / デモサイトでの動作確認

## Netlify preview

| 項目 | 決定 |
| --- | --- |
| 対象 | **本リポジトリ内**のデモ／サンプルサイト |
| 目的 | パッケージ利用例そのものの preview |
| 非対象（初期） | 別 example リポジトリ前提の preview |

デモサイトは `create` 相当の利用例として保守し、module と生成物の組み合わせが常に動作確認できる状態を目指す。

## 関連決定

- 決定 9, 10, 11 — [decisions.md](../decisions.md)
