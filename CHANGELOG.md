# Changelog

All notable changes to `@b4moss/hermit-crumb` are documented in this file.

## [Unreleased]

### Added

- Local CI rehearsal with [nektos/act](https://github.com/nektos/act) (`.actrc`, `docs/act.md`, `npm run act:ci`); run before every PR — manual only, not automated

### Fixed

- Quote-safe CI step name so `act` can parse `.github/workflows/ci.yml` (`file: link` → `file link`)

### Changed

- Node.js requirement raised to `>= 24.20` (dev + GitHub Actions + Netlify pin `24.20`)

## [0.1.0] — 2026-09-05

初回公開。

### Added

- Nuxt v4 module（`@b4moss/hermit-crumb`）— Pico.css / カラー CSS 変数 / `site.meta.yaml` / composables
- CLI `hermit-crumb create` — シェル・日英 content・デフォルト UI 一式
- CLI `hermit-crumb add` — コンポーネント追加（既存はスキップ、`--force` のみ上書き）
- モノレポ `playground` — create 相当のデモ（Netlify `preview-site` 対象）
- Migration guide (`docs/migration.md`)
- CD: `preview-site` → Netlify; `release` + `v*` tag → npm

### Notes

- Node.js `>= 22.19`
- 生成 UI / content は利用側所有（パッケージ更新では自動上書きしない）
