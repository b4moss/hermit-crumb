import { describe, expect, it } from "vitest";
import { minimarkToText, extractFaqFromBody } from "../src/runtime/utils/extractFaq";
import { faqListInjectionKey } from "../src/runtime/utils/faqListContext";

describe("faq utils", () => {
  it("flattens minimark trees", () => {
    expect(minimarkToText("hi")).toBe("hi");
    expect(minimarkToText(3)).toBe("3");
    expect(minimarkToText(["p", {}, "Hello", ["strong", {}, "X"]])).toBe("HelloX");
    expect(minimarkToText(["a", "b"])).toBe(""); // treated as empty element
    expect(minimarkToText([{ value: "a" }, { value: "b" }])).toBe("ab");
    expect(minimarkToText({ value: "V" })).toBe("V");
    expect(minimarkToText({ children: ["c", "d"] })).toBe(""); // ["c","d"] is an empty element\n    expect(minimarkToText({ children: [["span", {}, "c"], ["span", {}, "d"]] })).toBe("cd");
    expect(minimarkToText(null)).toBe("");
    expect(minimarkToText(undefined)).toBe("");
    expect(minimarkToText(true)).toBe("");
    expect(minimarkToText({ other: 1 })).toBe("");
  });

  it("extracts faq-item pairs", () => {
    const body = [
      ["faq-item", { question: " Q1 " }, ["p", {}, "Answer 1"]],
      ["div", {}, ["faq-item", { question: "Q2" }, ["p", {}, "Answer", " ", "2"]]],
    ];
    const result = extractFaqFromBody(body);
    expect(result).toHaveLength(2);
    expect(result[0].question).toBe("Q1");
    expect(result[0].answer).toBe("Answer 1");
    expect(result[1].question).toBe("Q2");
    expect(result[1].answer).toBe("Answer 2");
    expect(result[0].id).toMatch(/0$/);
    expect(result[1].id).toMatch(/1$/);

    expect(extractFaqFromBody([
      ["faq-item", { question: "" }, ["p", {}, "A"]],
      ["faq-item", { question: "Q" }, ["p", {}, ""]],
      ["p", {}, "nope"],
    ])).toEqual([]);
    expect(extractFaqFromBody(null)).toEqual([]);
    expect(extractFaqFromBody({ value: ["faq-item", { question: "Q" }, ["p", {}, "A"]] })).toHaveLength(1);
  });

  it("exposes stable injection key", () => {
    expect(faqListInjectionKey).toBe("doc-site-faq-list");
  });
});
