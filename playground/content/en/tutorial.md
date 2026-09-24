---
# @graph: WebPage + WebSite + HowTo + SoftwareSourceCode
title: Tutorial
description: From create through overrides, JSON-LD, and static generate
schemaRole: HowTo
---

# Tutorial

Scaffold a docs site, customize it, and static-generate. This page is also a `schemaRole: HowTo` sample.

## 1. Scaffold

```bash
npx @b4moss/hermit-crumb create my-docs
cd my-docs
npm install
```

## 2. Fill site meta

```bash
cp site.meta.yaml.example site.meta.yaml
```

Set real `siteName` / `siteUrl` / `githubUrl` / `software.*`. Enable `organization` when you need a publisher.

## 3. Shape content and nav

1. Edit or replace Markdown under `content/{ja,en}/`
2. Add `schemaRole` or `jsonLd` as needed ([JSON-LD](./json-ld.md))
3. Keep `app/config/docsNav.ts` and `i18n/locales/` `nav.*` in sync
4. For SSG, add paths to `nitro.prerender.routes`

## 4. Override look and feel

Add CSS under `app/assets/css/` and override Pico / hermit-crumb variables. Edit `app/components/**` when you need structural UI changes. Restore templates with `add --force` ([Overrides](./customize.md)).

## 5. Verify and generate

```bash
npm run dev
npm run generate
```

Output is `.output/public`. Deploy to your host (Netlify, etc.).

## Checklist

- [ ] `site.meta.yaml` URLs match production
- [ ] JA/EN pages and nav stay aligned
- [ ] FAQ uses `::faq-item` when emitting FAQPage
- [ ] Theme needs are met by CSS variable overrides
- [ ] Depend on a published `@b4moss/hermit-crumb` version
