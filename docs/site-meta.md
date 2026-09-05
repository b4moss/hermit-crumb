# `site.meta.yaml`

Site-wide metadata for UI, URLs, and JSON-LD. Schema/example ship with the package; values live in your project.

Loader: `packages/hermit-crumb/src/loadSiteMeta.ts`.

## Resolution order

1. Project `site.meta.yaml`
2. Project `site.meta.yaml.example`
3. Package-bundled `site.meta.yaml.example`
4. Built-in defaults via `normalizeSiteMeta`

Copy the example and edit:

```shell
cp site.meta.yaml.example site.meta.yaml
```

Reference file: [`packages/hermit-crumb/site.meta.yaml.example`](../packages/hermit-crumb/site.meta.yaml.example).

## Fields

| Field | Use |
| --- | --- |
| `siteName` / `siteUrl` / `siteVersion` / `description` | Branding, URLs, fallbacks |
| `githubUrl` / `npmUrl` | Header links (`npmUrl` empty → hide) |
| `footerText` | Footer copy |
| `software` | Site-wide `SoftwareSourceCode` (`name`, `codeRepository`, `license`, `programmingLanguage`) |
| `organization` | Optional publisher `Organization` |
| `jsonLdExtra` | Extra `@graph` entities for every page |

Page roles (`TechArticle` / `FAQPage` / `HowTo`) and per-page JSON-LD tweaks belong in Markdown frontmatter / body (`schemaRole`, `jsonLd.*`, `::faq-item`), not in this YAML. See generated/playground `docs/jsonld.md` and `docs/jsonld_ja.md`.

Loaded values are merged into `runtimeConfig.public` (see [module.md](./module.md)).
