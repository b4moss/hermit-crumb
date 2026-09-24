export type TocLink = {
  id: string;
  text: string;
  depth: number;
  children?: TocLink[];
};

const DEFAULT_TOC_DEPTH = 3;

/**
 * Normalize TOC max heading depth to an integer in 1..6.
 * Invalid / out-of-range values fall back to 3 (not clamp).
 */
export function normalizeTocDepth(
  input: unknown,
  fallback: number = DEFAULT_TOC_DEPTH,
): number {
  const fallbackDepth =
    typeof fallback === "number" &&
    Number.isFinite(fallback) &&
    fallback >= 1 &&
    fallback <= 6
      ? Math.trunc(fallback)
      : DEFAULT_TOC_DEPTH;

  if (typeof input !== "number" || !Number.isFinite(input)) {
    return fallbackDepth;
  }

  const depth = Math.trunc(input);
  if (depth < 1 || depth > 6) {
    return fallbackDepth;
  }
  return depth;
}

function isTocLink(value: unknown): value is TocLink {
  if (!value || typeof value !== "object") {
    return false;
  }
  const link = value as Record<string, unknown>;
  return (
    typeof link.id === "string" &&
    link.id.trim() !== "" &&
    typeof link.text === "string" &&
    link.text.trim() !== "" &&
    typeof link.depth === "number" &&
    Number.isFinite(link.depth)
  );
}

/**
 * Filter Nuxt Content `body.toc.links` to entries with depth <= maxDepth.
 * Returns new nodes; keeps parents whose children were filtered away with
 * `children: []`.
 */
export function filterTocLinks(
  links: unknown,
  maxDepthInput: unknown = DEFAULT_TOC_DEPTH,
): TocLink[] {
  const maxDepth = normalizeTocDepth(maxDepthInput);
  if (!Array.isArray(links)) {
    return [];
  }

  const result: TocLink[] = [];
  for (const entry of links) {
    if (!isTocLink(entry)) {
      continue;
    }
    if (entry.depth > maxDepth) {
      continue;
    }

    const children = filterTocLinks(entry.children, maxDepth);
    result.push({
      id: entry.id,
      text: entry.text,
      depth: entry.depth,
      children,
    });
  }
  return result;
}

/** Flatten TOC tree to document order (depth-first). */
export function flattenTocLinks(links: TocLink[]): TocLink[] {
  const flat: TocLink[] = [];
  const walk = (nodes: TocLink[]) => {
    for (const node of nodes) {
      flat.push(node);
      if (node.children?.length) {
        walk(node.children);
      }
    }
  };
  walk(links);
  return flat;
}

/**
 * Pick the active TOC id from currently intersecting heading ids.
 * When multiple intersect, prefer the topmost in document order.
 * When none intersect, keep `lastActiveId` if it is still a known heading.
 */
export function resolveActiveTocId(
  intersectingIds: Iterable<string>,
  orderedIds: string[],
  lastActiveId: string | null | undefined = null,
): string | null {
  if (!orderedIds.length) {
    return null;
  }

  const known = new Set(orderedIds);
  const intersecting = new Set<string>();
  for (const id of intersectingIds) {
    if (known.has(id)) {
      intersecting.add(id);
    }
  }

  if (intersecting.size > 0) {
    for (const id of orderedIds) {
      if (intersecting.has(id)) {
        return id;
      }
    }
  }

  if (lastActiveId && known.has(lastActiveId)) {
    return lastActiveId;
  }

  return null;
}

/**
 * Read TOC links from a Nuxt Content page object (`body.toc.links`, with a
 * top-level `toc.links` fallback).
 */
export function extractTocLinksFromPage(page: unknown): TocLink[] {
  if (!page || typeof page !== "object") {
    return [];
  }
  const record = page as Record<string, unknown>;

  const fromToc = (toc: unknown): TocLink[] => {
    if (!toc || typeof toc !== "object") {
      return [];
    }
    const links = (toc as Record<string, unknown>).links;
    return Array.isArray(links) ? (links as TocLink[]) : [];
  };

  if (record.body && typeof record.body === "object") {
    const bodyToc = fromToc((record.body as Record<string, unknown>).toc);
    if (bodyToc.length) {
      return bodyToc;
    }
  }

  return fromToc(record.toc);
}

/** Shared useState key for publishing page TOC links to DocsToc. */
export const DOCS_TOC_LINKS_STATE_KEY = "hermit-crumb-docs-toc-links";
