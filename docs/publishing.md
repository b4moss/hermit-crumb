# Publishing

## npm (`@b4moss/hermit-crumb`)

Workflow: [`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml).

Publish runs when **both** are true:

1. The commit on branch **`release`** has a **`v*`** tag (e.g. `v0.1.0`)
2. That version matches `packages/hermit-crumb/package.json` and is not already on npm

Secret: `NPM_TOKEN` (publish access for `@b4moss`).

```shell
# before tagging
npm ci
npm run build -w @b4moss/hermit-crumb
npm pack -w @b4moss/hermit-crumb

git tag v0.1.0 <sha>
git push origin v0.1.0
# merge or push the same commit to release
```

## Netlify (playground)

Config: [`netlify.toml`](../netlify.toml).

| Setting | Value |
| --- | --- |
| Production branch | `preview-site` |
| Build | `npm ci && npm run generate:playground` |
| Publish | `playground/.output/public` |
| Node | `24.20` |

Use Netlify Git integration (no dedicated deploy workflow). Point the site’s production branch at `preview-site`.

## CI

[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs lint, typecheck, build, tests, `smoke:create`, and `generate:playground` on mainline / PR branches.
