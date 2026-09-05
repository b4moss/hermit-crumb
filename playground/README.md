# playground

In-repo demo for `@b4moss/hermit-crumb` (create-equivalent: module + generated UI + JA/EN content + Pico). Netlify publishes this tree from the `preview-site` branch.

## Run

Node.js **>= 22.19**.

```shell
npm install
npm run build -w @b4moss/hermit-crumb
npm run dev:playground
npm run generate:playground
```

Publish directory: `playground/.output/public`.

## Notes

| | playground | `hermit-crumb create` |
| --- | --- | --- |
| Role | Reference + preview | New consumer project |
| Dependency | workspace `*` | `^0.1.0` |
| Color demo | `theme-override.css` | not included |

Theme override example: [`app/assets/css/theme-override.css`](./app/assets/css/theme-override.css). Remove it from `nuxt.config.ts` `css` to use package defaults.

Docs: [`docs/README.md`](../docs/README.md), Netlify: [`docs/publishing.md`](../docs/publishing.md).
