# npm 公開（`release` + タグ）

`@b4moss/hermit-crumb` を npmjs.org に出す手順です。CD 仕様の正は [`docs/specs/delivery/cd.md`](./specs/delivery/cd.md)（決定 19）。

## トリガー（確定）

両方を満たしたときだけ [`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml) が publish します。

1. 対象コミットに **`v*` タグ**がある（例: `v0.1.0`）
2. そのコミットが **`release` ブランチに push / マージ**される

タグ版（`v` 除去）は `packages/hermit-crumb/package.json` の `version` と一致必須。同一版が npm に既にあれば失敗します（再 publish しない）。

認証: GitHub Actions secret **`NPM_TOKEN`**（`@b4moss` scope で publish 可能な Automation / Granular token）。

## v0.1.0 公開条件チェック

| 条件 | 状態 |
| --- | --- |
| [overview](./specs/overview.md) の v0.1.0 スコープ実装 | Phase 0–5 スタックで充足（`dev-v0.1.0` へマージ前提） |
| Pico.css + CSS 変数のデモ | playground（Phase 3） |
| `create` / `add` / module の基本経路 | Phase 2–4B |
| 移行ガイド初版 | [`docs/migration.md`](./migration.md) |
| npm CD 配線 | 本リポの `npm-publish.yml` |
| Netlify preview 配線 | [`docs/netlify.md`](./netlify.md)（サイト接続はオーナー） |
| `NPM_TOKEN` Secrets | **オーナー設定が必要** |

## オーナー手順（初回 v0.1.0）

1. [ ] Phase 0–6 の PR を `dev-v0.1.0`（または公開 tip）へマージする
2. [ ] GitHub → Settings → Secrets → Actions に `NPM_TOKEN` を登録する
3. [ ] 公開したいコミットで version が `0.1.0` であることを確認する
4. [ ] タグを打って push する  
      `git tag v0.1.0 <sha>` / `git push origin v0.1.0`
5. [ ] 同じコミットを `release` へマージまたは fast-forward push する  
      （未作成なら tip から `git push origin <sha>:release`）
6. [ ] Actions「npm publish」が成功することを確認する
7. [ ] `npm view @b4moss/hermit-crumb version` が `0.1.0` であること

## ローカル確認（publish 前）

```shell
npm ci
npm run build -w @b4moss/hermit-crumb
npm pack -w @b4moss/hermit-crumb
# tarball に bin / dist / templates / site.meta.yaml.example が含まれること
```

## 関連

- 仕様: [cd.md](./specs/delivery/cd.md)、[publishing.md](./specs/delivery/publishing.md)
- CHANGELOG: [CHANGELOG.md](../CHANGELOG.md)
