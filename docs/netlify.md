# Netlify preview（`preview-site`）

本リポジトリのデモ（[`playground/`](../playground/)）を Netlify で配信するためのセットアップです。CD 仕様の正は [`docs/specs/delivery/cd.md`](./specs/delivery/cd.md)（決定 20）。

## 確定済みビルド設定

ルートの [`netlify.toml`](../netlify.toml) を使います。

| 項目 | 値 |
| --- | --- |
| トリガー | **`preview-site` ブランチへのマージ** |
| コマンド | `npm ci && npm run generate:playground` |
| Publish | `playground/.output/public` |
| Node | `22.19`（`.nvmrc` / `netlify.toml`） |

連携方式: **Netlify の Git 連携**（専用 GitHub Actions は置かない）。

## オーナー作業チェックリスト（5.4）

エージェントはトークンやサイト実体を作成できません。初回のみ人間側で実施してください。

1. [ ] [Netlify](https://www.netlify.com/) でサイトを新規作成する
2. [ ] GitHub リポジトリ `b4moss/hermit-crumb` を接続する
3. [ ] **Production branch** を `preview-site` にする（`main` / `dev-v0.1.0` ではない）
4. [ ] ビルド設定は `netlify.toml` を優先する（UI で上書きしない）
5. [ ] リモートに `preview-site` が無ければ、公開したい tip から作成して push する  
      例: `git fetch origin && git branch preview-site origin/dev-v0.1.0 && git push -u origin preview-site`  
      （スタック運用中はマージ済みの tip、または Phase 5 系列の先端を選ぶ）
6. [ ] `preview-site` への push / PR マージでデプロイが走り、サイトが開けることを確認する
7. [ ] （任意）ブランチ保護: `preview-site` は PR 経由のみ更新

## 日常の更新フロー

```text
feature / dev-v0.1.0 でデモを更新
  → PR を preview-site へ（または tip を preview-site にマージ）
  → Netlify が generate:playground してデプロイ
```

日常開発ブランチへのマージだけでは Netlify CD は起動しません。

## トラブルシュート

- **依存解決失敗**: ルートで `npm ci` しているか、Node 22.19 か確認
- **空サイト / 404**: publish が `playground/.output/public` か確認（`dist` symlink に依存しない）
- **古いデモが出る**: デプロイ対象コミットが意図した tip か、production branch が `preview-site` か確認
