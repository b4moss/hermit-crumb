import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeTocDepth,
  filterTocLinks,
  flattenTocLinks,
  resolveActiveTocId,
  extractTocLinksFromPage,
} from "../src/runtime/utils/toc.ts";

describe("normalizeTocDepth", () => {
  it("returns integers 1–6 unchanged", () => {
    for (const n of [1, 2, 3, 4, 5, 6]) {
      assert.equal(normalizeTocDepth(n), n);
    }
  });

  it("defaults to 3 when omitted", () => {
    assert.equal(normalizeTocDepth(undefined), 3);
  });

  it("falls back to 3 for out-of-range and non-numbers", () => {
    assert.equal(normalizeTocDepth(0), 3);
    assert.equal(normalizeTocDepth(7), 3);
    assert.equal(normalizeTocDepth(-1), 3);
    assert.equal(normalizeTocDepth(NaN), 3);
    assert.equal(normalizeTocDepth("3"), 3);
    assert.equal(normalizeTocDepth(null), 3);
  });

  it("truncates decimals then applies range rules", () => {
    assert.equal(normalizeTocDepth(3.9), 3);
    assert.equal(normalizeTocDepth(1.1), 1);
    assert.equal(normalizeTocDepth(6.9), 6);
    assert.equal(normalizeTocDepth(0.9), 3); // trunc → 0 → fallback
  });
});

describe("filterTocLinks", () => {
  const sample = [
    {
      id: "a",
      text: "A",
      depth: 1,
      children: [
        {
          id: "b",
          text: "B",
          depth: 2,
          children: [{ id: "c", text: "C", depth: 3 }],
        },
        {
          id: "d",
          text: "D",
          depth: 4,
        },
      ],
    },
  ];

  it("keeps depth <= 3 by default and empties filtered children", () => {
    const filtered = filterTocLinks(sample, 3);
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].id, "a");
    assert.equal(filtered[0].children.length, 1);
    assert.equal(filtered[0].children[0].id, "b");
    assert.equal(filtered[0].children[0].children.length, 1);
    assert.equal(filtered[0].children[0].children[0].id, "c");
    // depth 4 sibling dropped
    assert.ok(!filtered[0].children.some((c) => c.id === "d"));
  });

  it("depth 1 keeps only h1-level", () => {
    const filtered = filterTocLinks(sample, 1);
    assert.deepEqual(
      filtered.map((l) => l.id),
      ["a"],
    );
    assert.deepEqual(filtered[0].children, []);
  });

  it("depth 6 keeps all valid links", () => {
    const filtered = filterTocLinks(sample, 6);
    const flat = flattenTocLinks(filtered).map((l) => l.id);
    assert.deepEqual(flat, ["a", "b", "c", "d"]);
  });

  it("does not mutate the source tree", () => {
    const before = JSON.stringify(sample);
    filterTocLinks(sample, 2);
    assert.equal(JSON.stringify(sample), before);
  });

  it("returns [] for invalid links input", () => {
    assert.deepEqual(filterTocLinks(undefined, 3), []);
    assert.deepEqual(filterTocLinks(null, 3), []);
    assert.deepEqual(filterTocLinks("x", 3), []);
  });

  it("skips entries missing depth / empty id or text", () => {
    const filtered = filterTocLinks(
      [
        { id: "ok", text: "Ok", depth: 2 },
        { id: "no-depth", text: "X" },
        { id: "", text: "Empty id", depth: 2 },
        { id: "empty-text", text: "  ", depth: 2 },
        { text: "No id", depth: 2 },
      ],
      3,
    );
    assert.deepEqual(
      filtered.map((l) => l.id),
      ["ok"],
    );
  });
});

describe("resolveActiveTocId", () => {
  const order = ["a", "b", "c"];

  it("returns the sole intersecting id", () => {
    assert.equal(resolveActiveTocId(["b"], order, null), "b");
  });

  it("prefers the topmost id in document order when several intersect", () => {
    assert.equal(resolveActiveTocId(["c", "a"], order, null), "a");
  });

  it("keeps lastActiveId when intersection is empty", () => {
    assert.equal(resolveActiveTocId([], order, "b"), "b");
  });

  it("ignores unknown ids and returns null without history", () => {
    assert.equal(resolveActiveTocId(["z"], order, null), null);
    assert.equal(resolveActiveTocId([], order, "z"), null);
    assert.equal(resolveActiveTocId(["a"], [], null), null);
  });
});

describe("extractTocLinksFromPage", () => {
  it("reads body.toc.links", () => {
    const links = extractTocLinksFromPage({
      body: { toc: { links: [{ id: "x", text: "X", depth: 2 }] } },
    });
    assert.equal(links[0].id, "x");
  });

  it("falls back to top-level toc.links", () => {
    const links = extractTocLinksFromPage({
      toc: { links: [{ id: "y", text: "Y", depth: 2 }] },
    });
    assert.equal(links[0].id, "y");
  });

  it("returns [] for empty page", () => {
    assert.deepEqual(extractTocLinksFromPage(null), []);
    assert.deepEqual(extractTocLinksFromPage({}), []);
  });
});
