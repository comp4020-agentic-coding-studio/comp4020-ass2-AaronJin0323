import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// This site makes claims about itself — how many slides a deck has, how long
// its own lectures run. Those are the only assertions on the site that no
// content schema, a11y pass or link check can falsify, and the ones it can
// least afford to get wrong. So they are pinned here.

const deck = (slug: string) => readFileSync(resolve("dist/decks", slug, "index.html"), "utf8");
const slideCount = (html: string) => (html.match(/<section[\s>]/g) ?? []).length;

const NUMBER_WORDS: Record<string, number> = {
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
};

/** Words in a lecture body, ignoring frontmatter, headings and list markers. */
function lectureWordCount(week: number): number {
  const path = resolve("src/content/lectures", `week-${String(week).padStart(2, "0")}.md`);
  return readFileSync(path, "utf8")
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    .split("\n")
    .filter((line) => !line.startsWith("#"))
    .join(" ")
    .replace(/[`*_>|]/g, " ")
    .replace(/^\s*[-–]\s*/gm, " ")
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}

describe("claims the site makes about itself", () => {
  it("counts its own slides correctly when a deck says how many it has", () => {
    for (const slug of ["week-01", "week-08", "week-12"]) {
      const html = deck(slug);
      const claim = html.match(/This deck has (\w+) slides/);
      if (!claim) continue;
      const claimed = NUMBER_WORDS[claim[1]];
      expect(claimed, `${slug} claims "${claim[1]}" slides, which isn't a number I parse`).toBeDefined();
      expect(slideCount(html), `${slug} says it has ${claim[1]} slides`).toBe(claimed);
    }
  });

  it("counts week 8's slides correctly when week 12 points back at them", () => {
    // The renderer curls apostrophes, so match either form.
    const claim = deck("week-12").match(/Week 8['\u2019]s had (\w+)/);
    expect(claim, "week 12's punchline no longer cites week 8's slide count").not.toBeNull();
    expect(slideCount(deck("week-08")), "week 12 misreports week 8's length").toBe(
      NUMBER_WORDS[claim![1]],
    );
  });

  it("reports its own lecture word counts as measured, not as hoped", () => {
    const html = deck("week-08");
    // The emphasised peaks render as <strong>, so capture the whole paragraph
    // and strip tags rather than stopping at the first one.
    const audit = html.match(/lecture, weeks 1 through 12:<\/p>\s*<p>(.*?)<\/p>/s);
    expect(audit, "week 8's self-audit slide no longer states a word-count series").not.toBeNull();

    const stated = (audit![1].replace(/<[^>]+>/g, " ").match(/\d+/g) ?? []).map(Number);
    const measured = Array.from({ length: 12 }, (_, i) => lectureWordCount(i + 1));
    expect(stated, "the self-audit must state one figure per teaching week").toHaveLength(12);
    expect(stated, "week 8's stated word counts have drifted from the lectures").toEqual(measured);
  });

  it("is telling the truth about where that curve peaks", () => {
    const counts = Array.from({ length: 12 }, (_, i) => lectureWordCount(i + 1));
    const peak = counts.indexOf(Math.max(...counts)) + 1;
    const runnerUp = counts.indexOf(Math.max(...counts.filter((c) => c < Math.max(...counts)))) + 1;
    expect(
      [peak, runnerUp].sort((a, b) => a - b),
      "week 8's slide names weeks 3 and 12 as the two peaks",
    ).toEqual([3, 12]);
    expect(counts[7], "week 8's slide calls itself a local dip").toBeLessThan(counts[6]);
  });
});
