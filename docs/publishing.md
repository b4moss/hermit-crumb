# Publishing & CI/CD

## Branch roles

| Branch | Role |
| --- | --- |
| `develop` / `dev-*` | Integration. PRs here run package CI. |
| `main` | Stable line. Codecov + OpenSSF Scorecard on push (no package CI). |
| `release` | npm CD. Tagged commit with matching `package.json` version → publish. |
| `preview-site` | Doc site (playground) CD. PR checks in Actions; Netlify deploys on merge. |

## CI (package)

Workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

| Trigger | Behavior |
| --- | --- |
| PR → `develop` or `dev-*` | One job: lint → typecheck → unit+integration → `smoke:create` (single `npm ci`). Playground excluded. |
| Docs-only changes | Skip heavy steps (`docs/**`, root `README.md` / `CHANGELOG.md` / `LICENSE`, package & playground READMEs). |
| Same head SHA already green | Skip heavy steps. |

No CI on push to `main` / `develop` / `release` (avoid re-running what the PR already proved). Required check name: **CI**.

## CD — npm (`@b4moss/hermit-crumb`)

Workflow: [`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml).

Publish when **all** are true:

1. A **`v*`** tag exists (e.g. `v0.1.0`) and matches `packages/hermit-crumb/package.json`
2. That tagged commit is on branch **`release`**
3. The version is not already on npm (if it is, the job succeeds as a no-op)

### Release flow

```shell
# on main
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

Triggers: `release` published, or push to `release` (so publish still runs if the tag lands on `release` after the Release event).

Secret: `NPM_TOKEN` (publish access for `@b4moss`).

## CD — doc site / playground (Netlify)

| Step | Where |
| --- | --- |
| PR → `preview-site` | [`.github/workflows/doc-site.yml`](../.github/workflows/doc-site.yml) runs `typecheck:playground` + `generate:playground` |
| Merge → `preview-site` | Netlify Git integration builds and deploys ([`netlify.toml`](../netlify.toml)) |

No Netlify token in GitHub Actions — production branch in the Netlify UI must be `preview-site`.

| Setting | Value |
| --- | --- |
| Production branch | `preview-site` |
| Build | `npm ci && npm run typecheck:playground && npm run generate:playground` |
| Publish directory | `playground/.output/public` |
| Node | `.nvmrc` (`22.19`) |

## Main-only quality

| Workflow | When | Notes |
| --- | --- | --- |
| [`.github/workflows/codecov.yml`](../.github/workflows/codecov.yml) | Push to `main` | Coverage upload. Informational (`fail_ci_if_error: false`). Org secret `CODECOV_TOKEN`. |
| [`.github/workflows/scorecard.yml`](../.github/workflows/scorecard.yml) | Push to `main` + weekly | OpenSSF Scorecard → code scanning SARIF. |

## Secrets checklist

| Secret | Scope | Used by |
| --- | --- | --- |
| `NPM_TOKEN` | repo (or org) | npm publish |
| `CODECOV_TOKEN` | organization | Codecov upload on `main` |
