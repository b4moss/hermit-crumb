# Publishing & CI/CD

## Branch roles

| Branch | Role |
| --- | --- |
| `develop` / `dev-*` | Integration. PRs here always run package CI (unit + integration). |
| `main` | Stable line. CI on push (skipped if the SHA already passed). Codecov + OpenSSF Scorecard on push. |
| `release` | npm CD. Tagged commit with matching `package.json` version → publish. |
| `preview-site` | Doc site (playground) CD. PR checks in Actions; Netlify deploys on merge. |

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

| Step | Where |
| --- | --- |
| PR → `preview-site` | [`.github/workflows/doc-site.yml`](../.github/workflows/doc-site.yml) runs `typecheck:playground` + `generate:playground` |
| Merge → `preview-site` | Netlify Git integration builds and deploys ([`netlify.toml`](../netlify.toml); build also runs typecheck + generate) |

No Netlify token in GitHub Actions — production branch in the Netlify UI must be `preview-site`.

| Setting | Value |
| --- | --- |
| Production branch | `preview-site` |
| Build | `npm ci && npm run typecheck:playground && npm run generate:playground` |
| Publish directory | `playground/.output/public` |
| Node | `.nvmrc` (`22.19`) |

## Main-only quality (badges later)

| Workflow | When | Notes |
| --- | --- | --- |
| [`.github/workflows/codecov.yml`](../.github/workflows/codecov.yml) | Push to `main` | Uploads Node test coverage. Uses org secret `CODECOV_TOKEN`. |
| [`.github/workflows/scorecard.yml`](../.github/workflows/scorecard.yml) | Push to `main` | OpenSSF Scorecard → code scanning SARIF. |

## Secrets checklist

| Secret | Scope | Used by |
| --- | --- | --- |
| `NPM_TOKEN` | repo (or org) | npm publish |
| `CODECOV_TOKEN` | organization | Codecov upload on `main` |
