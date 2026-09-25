# Migration from `doc-site`

If you still use `b4moss/git-template` branch `doc-site`, switch to `@b4moss/hermit-crumb` as follows.

## Recommended path

1. Generate a fresh site with `npx @b4moss/hermit-crumb create my-docs` (or mirror [`playground/`](../playground/)).
2. Move your Markdown into `content/{ja,en}/`; keep `schemaRole` / JSON-LD frontmatter conventions.
3. Copy `site.meta.yaml.example` → `site.meta.yaml` and fill site values (software / organization live here, not in every page).
4. Port custom UI into the generated components under `app/components/` (avoid deep `extends`).
5. Replace bespoke CSS with Pico + CSS variable overrides ([theming.md](./theming.md)).
6. Align peer dependency versions with `packages/hermit-crumb/package.json` (`nuxt` ^4.5.2, Content ^3.14, i18n ^9.5.6, color-mode ^4, scripts ^1.3).

## Mapping

| Before (`doc-site`) | After |
| --- | --- |
| Clone template repo | npm package + `create` / `add` |
| Shell + UI in one tree | Module for shell; UI generated into your app |
| Custom CSS-first | Pico.css + CSS variables |

There is no automated migrator. Use `add --force` only when you intentionally replace a generated file.
