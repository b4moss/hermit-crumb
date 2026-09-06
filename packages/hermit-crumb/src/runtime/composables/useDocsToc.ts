import type { MaybeRefOrGetter } from "vue";
import {
  DOCS_TOC_LINKS_STATE_KEY,
  filterTocLinks,
  flattenTocLinks,
  normalizeTocDepth,
  resolveActiveTocId,
  type TocLink,
} from "../utils/toc";

export type { TocLink };
export {
  DOCS_TOC_LINKS_STATE_KEY,
  extractTocLinksFromPage,
  filterTocLinks,
  flattenTocLinks,
  normalizeTocDepth,
  resolveActiveTocId,
} from "../utils/toc";

export type UseDocsTocOptions = {
  /** Max heading depth (1–6). Default 3. */
  depth?: MaybeRefOrGetter<number | undefined>;
  /**
   * Explicit TOC links. When omitted, reads shared `useState` published by the
   * docs page (`setDocsTocLinks` / `DOCS_TOC_LINKS_STATE_KEY`).
   */
  links?: MaybeRefOrGetter<TocLink[] | null | undefined>;
  /** IntersectionObserver rootMargin. */
  rootMargin?: MaybeRefOrGetter<string | undefined>;
};

/** Publish TOC links for the docs layout DocsToc (call from the page). */
export function setDocsTocLinks(links: TocLink[] | null | undefined) {
  const state = useState<TocLink[]>(DOCS_TOC_LINKS_STATE_KEY, () => []);
  state.value = Array.isArray(links) ? links : [];
}

/** Scan rendered prose headings when Content TOC data is missing. */
function collectHeadingLinksFromDom(maxDepth: number): TocLink[] {
  if (!import.meta.client || typeof document === "undefined") {
    return [];
  }
  const root =
    document.querySelector("main .prose, main article.prose, article.prose") ??
    document.querySelector("main");
  if (!root) {
    return [];
  }

  const selector = Array.from({ length: maxDepth }, (_, i) => `h${i + 1}`).join(
    ",",
  );
  const headings = root.querySelectorAll(selector);
  const links: TocLink[] = [];
  for (const node of headings) {
    if (!(node instanceof HTMLElement) || !node.id) {
      continue;
    }
    const depth = Number(node.tagName.slice(1));
    if (!Number.isFinite(depth) || depth < 1 || depth > maxDepth) {
      continue;
    }
    const text = (node.textContent || "").replace(/#$/, "").trim();
    if (!text) {
      continue;
    }
    links.push({ id: node.id, text, depth, children: [] });
  }
  return links;
}

export function useDocsToc(options: UseDocsTocOptions = {}) {
  const sharedLinks = useState<TocLink[]>(DOCS_TOC_LINKS_STATE_KEY, () => []);
  const domLinks = ref<TocLink[]>([]);

  const depth = computed(() => normalizeTocDepth(toValue(options.depth)));

  const sourceLinks = computed(() => {
    const explicit = options.links != null ? toValue(options.links) : null;
    if (Array.isArray(explicit) && explicit.length) {
      return explicit;
    }
    if (sharedLinks.value.length) {
      return sharedLinks.value;
    }
    return domLinks.value;
  });

  const links = computed(() => filterTocLinks(sourceLinks.value, depth.value));
  const flatLinks = computed(() => flattenTocLinks(links.value));
  const orderedIds = computed(() => flatLinks.value.map((link) => link.id));

  const activeId = ref<string | null>(null);
  const intersectingIds = ref<Set<string>>(new Set());

  let observer: IntersectionObserver | null = null;

  function syncActiveId() {
    activeId.value = resolveActiveTocId(
      intersectingIds.value,
      orderedIds.value,
      activeId.value,
    );
  }

  function teardownObserver() {
    observer?.disconnect();
    observer = null;
    intersectingIds.value = new Set();
  }

  function refreshDomLinks() {
    if (!import.meta.client) {
      return;
    }
    const explicit = options.links != null ? toValue(options.links) : null;
    if (
      (Array.isArray(explicit) && explicit.length) ||
      sharedLinks.value.length
    ) {
      domLinks.value = [];
      return;
    }
    domLinks.value = collectHeadingLinksFromDom(depth.value);
  }

  function setupObserver() {
    teardownObserver();

    if (!import.meta.client) {
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const ids = orderedIds.value;
    if (!ids.length) {
      activeId.value = null;
      return;
    }

    const margin = toValue(options.rootMargin) ?? "0px 0px -55% 0px";

    observer = new IntersectionObserver(
      (entries) => {
        const next = new Set(intersectingIds.value);
        for (const entry of entries) {
          const id = entry.target.id;
          if (!id) continue;
          if (entry.isIntersecting) next.add(id);
          else next.delete(id);
        }
        intersectingIds.value = next;
        syncActiveId();
      },
      {
        root: null,
        rootMargin: margin,
        threshold: [0, 1],
      },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    syncActiveId();
  }

  if (import.meta.client) {
    watch(
      [orderedIds, depth, sharedLinks],
      async () => {
        await nextTick();
        refreshDomLinks();
        await nextTick();
        setupObserver();
      },
      { flush: "post" },
    );

    onMounted(async () => {
      await nextTick();
      refreshDomLinks();
      await nextTick();
      setupObserver();
    });

    onBeforeUnmount(() => {
      teardownObserver();
    });
  }

  return {
    depth,
    links,
    flatLinks,
    orderedIds,
    activeId,
    setLinks: setDocsTocLinks,
  };
}
