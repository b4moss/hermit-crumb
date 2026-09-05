# Theming

Style base is **Pico.css** (`@picocss/pico`). Default color and layout tokens ship in `packages/hermit-crumb/src/runtime/styles/tokens.css`, injected by the module when `injectStyles` is true.

Do not import Pico yourself in the consumer app unless you set `injectStyles: false`.

## Color mode

`@nuxtjs/color-mode` is configured for Pico’s `data-theme="light|dark"` attribute. Tokens are defined under:

- `:root` / `[data-theme="light"]`
- `[data-theme="dark"]` / `html.dark`

## Override site colors

Add a CSS file after the module styles and override variables. Example from playground:

[`playground/app/assets/css/theme-override.css`](../playground/app/assets/css/theme-override.css)

Common variables to override:

| Variable | Purpose |
| --- | --- |
| `--pico-primary*` | Pico primary palette |
| `--color-accent`, `--color-accent-soft`, `--color-accent-hover` | Shell accent aliases |
| `--color-bg`, `--color-surface`, `--color-ink`, `--color-muted`, `--color-border` | Surfaces / text |
| `--hc-max-width`, `--hc-header-height`, `--hc-sidebar-width` | Layout shells |

Prefer CSS variable overrides over editing generated Vue components.

## Disable module styles

```ts
hermitCrumb: {
  injectStyles: false,
}
```

Then you own Pico/token loading entirely.
