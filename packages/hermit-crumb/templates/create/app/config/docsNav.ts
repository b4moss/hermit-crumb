export type DocsNavItem = {
  key: string;
  path: string;
  /** i18n key under `nav.*` (e.g. `home` → `nav.home`). */
  labelKey: string;
  /** When set, item is a child of this nav key (shown indented in sidebar). */
  parent?: string;
};

/**
 * Accordion behaviour for nested sidebar groups.
 * - expandable: false → children always visible (legacy indent only)
 * - defaultOpen: initial open state when expandable
 * - persist: remember open/closed per parent key in localStorage
 */
export const docsNavAccordion = {
  expandable: true,
  defaultOpen: false,
  persist: true,
} as const;

/**
 * Edit this list to shape the docs sidebar / pager.
 * Labels come from `i18n/locales/{ja,en}.ts` → `nav.<labelKey>`.
 */
export const docsNavItems: DocsNavItem[] = [
  { key: "home", path: "/", labelKey: "home" },
  { key: "gettingStarted", path: "/getting-started", labelKey: "gettingStarted" },
  { key: "overview", path: "/overview", labelKey: "overview", parent: "gettingStarted" },
  { key: "install", path: "/install", labelKey: "install", parent: "gettingStarted" },
  { key: "api", path: "/api", labelKey: "api" },
  { key: "tutorial", path: "/tutorial", labelKey: "tutorial" },
  { key: "faq", path: "/faq", labelKey: "faq" },
  { key: "syntaxContrast", path: "/syntax-contrast", labelKey: "syntaxContrast" },
];
