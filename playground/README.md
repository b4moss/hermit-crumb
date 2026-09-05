# playground

本リポジトリ内のデモ／サンプルサイト。`b4moss/git-template` の `doc-site` ブランチを Phase 1 で一括移植したもの。Netlify preview（`preview-site` CD）の対象になる。

## 起動

前提: Node.js **>= 22.19**。

リポジトリルートで:

```shell
npm install
npm run dev:playground
# または
npm run generate:playground
```

## 現状（Phase 1）

- Nuxt アプリとして `dev` / `generate` が通ることを目標とする
- 依存バージョンは移植元 `doc-site` の `package.json` に固定
- `@b4moss/hermit-crumb` は workspace 依存として参照するが、**module 登録はまだしない**（Phase 2）

## 今後

- **Phase 2**: 殻ロジックを `@b4moss/hermit-crumb` module へ寄せ、playground は利用側に寄せる
- **Phase 3**: Pico.css ＋ CSS 変数カラー
- **Phase 5**: Netlify CD（`preview-site`）
