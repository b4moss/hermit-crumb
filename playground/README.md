# playground

本リポジトリ内のデモ／サンプルサイト。`b4moss/git-template` の `doc-site` を移植し、`@b4moss/hermit-crumb` module の利用例として保守する。Netlify preview（`preview-site` CD）の対象。

## 起動

前提: Node.js **>= 22.19**。

```shell
npm install
npm run build -w @b4moss/hermit-crumb
npm run dev:playground
# または
npm run generate:playground
```

## 現状（Phase 2）

- `nuxt.config` は `modules: ['@b4moss/hermit-crumb']`
- `site.meta.yaml` 読込とロジック（ナビ / JSON-LD / FAQ 等）はパッケージ側
- UI・content・`app/config/docsNav.ts` は playground 所有
- Pico.css は Phase 3
