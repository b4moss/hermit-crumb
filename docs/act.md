# Local CI with act

[nektos/act](https://github.com/nektos/act) runs [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) on your machine before you open a pull request.

This is a **manual** developer step. There is no pre-commit hook, CI job, or other automation that runs `act` for you.

## Prerequisites

1. **Docker** (Desktop or Engine) running
2. **act** installed ([install guide](https://nektosact.com/installation/))

```shell
# examples
brew install act
# or
curl -sSfL https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

## Project defaults

| File | Role |
| --- | --- |
| [`.actrc`](../.actrc) | Runner image, `linux/amd64`, CI workflow only |
| [`.github/act/pull_request.json`](../.github/act/pull_request.json) | Minimal `pull_request` event payload |

`.actrc` pins `-W .github/workflows/ci.yml` so a bare `act pull_request` does **not** pick up [`npm-publish.yml`](../.github/workflows/npm-publish.yml) (secrets / publish side effects).

Do **not** commit a `.secrets` file with real tokens. Prefer never running the publish workflow via act.

## Before every PR

From the repository root, with Docker running:

```shell
act pull_request -e .github/act/pull_request.json
```

Equivalent shortcut (same flags come from `.actrc`):

```shell
npm run act:ci
```

Fix any failures before opening or updating the PR. Remote GitHub Actions remain the source of truth; act is a local rehearsal.

## Useful variants

```shell
# list jobs without running
act -l

# single job (name from the workflow)
act pull_request -e .github/act/pull_request.json -j check

# verbose
act pull_request -e .github/act/pull_request.json -v
```

## Notes

- First run downloads the runner image and actions; later runs are faster.
- Apple Silicon uses `--container-architecture linux/amd64` from `.actrc` (QEMU emulation).
- If setup-node cache behaves differently under act, treat remote CI as authoritative when results disagree.
