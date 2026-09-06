<script setup lang="ts">
type TocLink = {
  id: string;
  text: string;
  depth: number;
  children?: TocLink[];
};

const props = withDefaults(
  defineProps<{
    /** Max heading depth to include (1–6). Default 3. */
    depth?: number;
    /** Optional explicit links; otherwise uses page-published TOC state. */
    links?: TocLink[] | null;
  }>(),
  {
    depth: 3,
  },
);

const { flatLinks, activeId } = useDocsToc({
  depth: () => props.depth,
  links: () => props.links,
});

const { t } = useI18n();
</script>

<template>
  <nav
    v-if="flatLinks.length"
    class="docs-toc"
    :aria-label="t('nav.toc')"
  >
    <p class="docs-toc__title">{{ t("nav.toc") }}</p>
    <ul class="docs-toc__list">
      <li
        v-for="link in flatLinks"
        :key="link.id"
        class="docs-toc__item"
      >
        <a
          :href="`#${link.id}`"
          class="docs-toc__link"
          :class="[
            `docs-toc__link--depth-${link.depth}`,
            { 'docs-toc__link--active': activeId === link.id },
          ]"
          :aria-current="activeId === link.id ? 'location' : undefined"
        >
          {{ link.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.docs-toc {
  /* Override Pico `nav` flex row / centered items. */
  display: none;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  text-align: left;
}

@media (min-width: 1100px) {
  .docs-toc {
    display: flex;
    position: sticky;
    top: var(--header-height);
    flex-shrink: 0;
    width: var(--toc-width, var(--hc-toc-width, 14rem));
    max-height: calc(100vh - var(--header-height));
    margin: 0;
    padding: 2rem 1rem 2rem 0.75rem;
    overflow-y: auto;
    align-self: flex-start;
  }
}

.docs-toc__title {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-align: left;
  color: var(--color-muted);
}

.docs-toc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.1rem;
}

.docs-toc__list:first-of-type,
.docs-toc__list:last-of-type {
  margin-left: 0;
  margin-right: 0;
}

.docs-toc__item {
  display: block;
  margin: 0;
  padding: 0;
}

.docs-toc__link {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 0.25rem 0.4rem;
  border-radius: 0.3rem;
  border-left: 2px solid transparent;
  color: var(--color-muted);
  text-align: left;
  text-decoration: none;
  font-size: 0.85rem;
  line-height: 1.35;
}

.docs-toc__link--depth-1 {
  font-weight: 600;
}

.docs-toc__link--depth-3 {
  padding-left: 0.85rem;
  font-size: 0.8rem;
}

.docs-toc__link--depth-4 {
  padding-left: 1.25rem;
  font-size: 0.8rem;
}

.docs-toc__link--depth-5,
.docs-toc__link--depth-6 {
  padding-left: 1.6rem;
  font-size: 0.8rem;
}

.docs-toc__link--depth-2 {
  padding-left: 0.45rem;
}

.docs-toc__link:hover {
  color: var(--color-ink);
  background: var(--color-accent-soft);
}

.docs-toc__link--active {
  color: var(--color-accent);
  border-left-color: var(--color-accent);
  font-weight: 600;
}
</style>
