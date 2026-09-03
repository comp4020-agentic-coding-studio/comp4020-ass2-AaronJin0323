import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  course: { code: string };
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const byType = (type: string) => api.nodes.filter((node) => node.type === type);

describe("assignment 2 spec", () => {
  it("runs across twelve dated teaching weeks, one session per week", () => {
    const sessions = byType("sessions");
    const weeks = sessions.map((node) => node.meta?.week);
    expect(sessions, "expected one session per teaching week").toHaveLength(12);
    expect(new Set(weeks).size, "every week 1-12 must be represented exactly once").toBe(12);
    for (let week = 1; week <= 12; week++) {
      expect(weeks, `no session found for week ${week}`).toContain(week);
    }
  });

  it("keeps the three digits the repo was provisioned with in the SLOPxxxx code", () => {
    expect(api.course.code, "the last three digits must stay 024").toMatch(/024$/);
  });

  it("has at least one lecture that carries a real deck, linked from its page", () => {
    const lecturesWithDecks = byType("lectures").filter(
      (node) => typeof node.meta?.slides === "string",
    );
    expect(lecturesWithDecks.length, "at least one lecture needs a slides deck").toBeGreaterThan(0);

    for (const lecture of lecturesWithDecks) {
      const slidesPath = lecture.meta?.slides as string;
      const deckSlug = slidesPath.replace(/^\/decks\//, "").replace(/\/$/, "");
      expect(
        () => readFileSync(resolve("dist/decks", deckSlug, "index.html"), "utf8"),
        `${lecture.id} links a deck that wasn't built at ${slidesPath}`,
      ).not.toThrow();

      const lectureSlug = lecture.id.replace(/^lectures\//, "");
      const lecturePage = readFileSync(resolve("dist/lectures", lectureSlug, "index.html"), "utf8");
      expect(
        lecturePage.includes(slidesPath),
        `${lecture.id}'s page doesn't link to its deck at ${slidesPath}`,
      ).toBe(true);
    }
  });

  it("adds up assessment weights to 100%", () => {
    const total = byType("assessments").reduce(
      (sum, node) => sum + (Number(node.meta?.weight) || 0),
      0,
    );
    expect(total, "assessment weights must sum to 100").toBe(100);
  });
});
