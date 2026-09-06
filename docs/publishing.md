# Publishing & CI/CD

## Branch roles

| Branch | Role |
| --- | --- |
| `develop` / `dev-*` | Integration. PRs here always run package CI (unit + integration). |
| `main` | Stable line. CI on push (skipped if the SHA already passed). Codecov + OpenSSF Scorecard on push. |
| `release` | npm CD. Tagged commit with matching `package.json` version → publish. |
| `preview-site` | Doc site (playground) CD. Playground tests, then Netlify deploy. |

## CI (package)

Workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

| Trigger | Behavior |
| --- | --- |
| PR → `develop` or `dev-*` | lint / typecheck·build / unit+integration test / `smoke:create` (parallel). Playground excluded. |
| Push → `main`, `develop`, `release` | Same checks, but **skip** if this commit SHA already has a successful CI run. |
| Docs-only changes | Skip tests (`docs/**`, root `README.md` / `CHANGELOG.md` / `LICENSE`, package & playground READMEs). |

Jobs use npm cache and run in parallel. A final **CI result** job aggregates status for branch protection.

## CD — npm (`@b4moss/hermit-crumb`)

Workflow: [`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml).

Publish when **all** are true:

1. A **`v*`** tag exists (e.g. `v0.1.0`) and matches `packages/hermit-crumb/package.json`
2. That tagged commit is on branch **`release`**
3. The version is not already on npm (if it is, the job succeeds as a no-op)

### Release flow

```shell
# on main, after CI is green
npm ci
npm run build -w @b4moss/hermit-crumb
npm pack -w @b4moss/hermit-crumb

git tag v0.1.0
git push origin v0.1.0
# Create a GitHub Release from that tag (UI or gh release create)

# land the same tagged commit on release
git push origin main:release
# or merge a PR into release
```

Triggers: push to `release`, or `release` published (skips until the tag is on `release`).

Secret: `NPM_TOKEN` (publish access for `@b4moss`).

## CD — doc site / playground (Netlify)

Workflow: [`.github/workflows/doc-site.yml`](../.github/workflows/doc-site.yml).  
Config reference: [`netlify.toml`](../netlify.toml).

| Trigger | Behavior |
| --- | --- |
| PR → `preview-site` | `typecheck:playground` + `generate:playground` |
| Push → `preview-site` | Same tests, then **Netlify production deploy** |

Git-triggered Netlify builds are ignored (`[build].ignore`) so deploy runs only from Actions after tests pass.

Secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`.

| Setting | Value |
| --- | --- |
| Production branch | `preview-site` |
| Publish directory | `playground/.output/public` |
| Node | `.nvmrc` (`22.19`) |

## Main-only quality (badges later)

| Workflow | When | Notes |
| --- | --- | --- |
| [`.github/workflows/codecov.yml`](../.github/workflows/codecov.yml) | Push to `main` | Uploads Node test coverage. Secret: `CODECOV_TOKEN` (upload is non-blocking without it). |
| [`.github/workflows/scorecard.yml`](../.github/workflows/scorecard.yml) | Push to `main` | OpenSSF Scorecard → code scanning SARIF. |

## Secrets checklist

| Secret | Used by |
| --- | --- |
| `NPM_TOKEN` | npm publish |
| `NETLIFY_AUTH_TOKEN` | doc-site deploy |
| `NETLIFY_SITE_ID` | doc-site deploy |
| `CODECOV_TOKEN` | Codecov (optional until badge is enabled) |
