/**
 * Phase 0 stub for the Nuxt module entry.
 * Full module wiring (Content / i18n / color-mode / site.meta / Pico) lands in Phase 2.
 */
export interface HermitCrumbModuleOptions {
  // Intentionally empty in Phase 0.
}

export default function hermitCrumbModule(
  _options: HermitCrumbModuleOptions = {},
): { name: string } {
  return {
    name: '@b4moss/hermit-crumb',
  }
}
