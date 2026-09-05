/**
 * `add` テンプレート一覧と生成先パス。
 * 生成後のファイルは利用側所有。パッケージ更新では自動上書きしない。
 */

/** @typedef {{ name: string, template: string, out: string, note?: string }} AddTemplate */

/** @type {AddTemplate[]} */
export const ADD_TEMPLATES = [
  {
    name: "DocsPager",
    template: "DocsPager.vue",
    out: "app/components/DocsPager.vue",
  },
  {
    name: "DocsJsonLd",
    template: "DocsJsonLd.vue",
    out: "app/components/DocsJsonLd.vue",
  },
  {
    name: "FaqList",
    template: "FaqList.vue",
    out: "app/components/content/FaqList.vue",
  },
  {
    name: "FaqItem",
    template: "FaqItem.vue",
    out: "app/components/content/FaqItem.vue",
  },
  {
    name: "CollapseBox",
    template: "CollapseBox.vue",
    out: "app/components/content/CollapseBox.vue",
  },
  {
    name: "SiteHeader",
    template: "SiteHeader.vue",
    out: "app/components/SiteHeader.vue",
    note: "create デフォルト UI（復旧用にも add 可）",
  },
  {
    name: "SiteFooter",
    template: "SiteFooter.vue",
    out: "app/components/SiteFooter.vue",
    note: "create デフォルト UI（復旧用にも add 可）",
  },
  {
    name: "DocsSidebar",
    template: "DocsSidebar.vue",
    out: "app/components/DocsSidebar.vue",
    note: "create デフォルト UI（復旧用にも add 可）",
  },
  {
    name: "HeaderPrefsMenu",
    template: "HeaderPrefsMenu.vue",
    out: "app/components/HeaderPrefsMenu.vue",
    note: "create デフォルト UI（復旧用にも add 可）",
  },
  {
    name: "HeaderDropdown",
    template: "HeaderDropdown.vue",
    out: "app/components/HeaderDropdown.vue",
    note: "create デフォルト UI（復旧用にも add 可）",
  },
];

/** @param {string} name */
export function findTemplate(name) {
  const needle = name.toLowerCase();
  return ADD_TEMPLATES.find((t) => t.name.toLowerCase() === needle) ?? null;
}
