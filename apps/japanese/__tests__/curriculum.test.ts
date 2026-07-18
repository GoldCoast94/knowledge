import { describe, it, expect } from "vitest";
import { topics } from "@/lib/data";
import { buildLesson, makeChineseMeaning } from "@/lib/utils";
import { curriculum, sidebarData } from "@/lib/curriculum";

describe("data", () => {
  it("has 12 months", () => {
    expect(topics).toHaveLength(12);
  });

  it("each month has 4 weeks", () => {
    for (const month of topics) {
      expect(month.weeks).toHaveLength(4);
    }
  });

  it("each topic week has required fields", () => {
    for (const month of topics) {
      for (const week of month.weeks) {
        expect(week.title).toBeTruthy();
        expect(week.focus).toBeTruthy();
        expect(week.tags.length).toBeGreaterThan(0);
        expect(week.grammar.length).toBeGreaterThan(0);
        expect(week.vocab.length).toBeGreaterThan(0);
        expect(week.task).toBeTruthy();
      }
    }
  });
});

describe("buildLesson", () => {
  const topic = topics[0];
  const lesson = buildLesson(1, 1, topic, topic.weeks[0]);

  it("generates correct id", () => {
    expect(lesson.id).toBe("m1-w1");
  });

  it("has required lesson fields", () => {
    expect(lesson.title).toBeTruthy();
    expect(lesson.focus).toBeTruthy();
    expect(lesson.time).toBeTruthy();
    expect(lesson.method).toBeTruthy();
    expect(lesson.tags.length).toBeGreaterThan(0);
    expect(lesson.objectives).toHaveLength(4);
  });

  it("has explain blocks", () => {
    expect(lesson.explain.length).toBeGreaterThan(0);
    for (const block of lesson.explain) {
      expect(block.title).toBeTruthy();
      expect(block.body.length).toBeGreaterThan(0);
    }
  });

  it("has patterns matching grammar count", () => {
    expect(lesson.patterns).toHaveLength(topic.weeks[0].grammar.length);
  });

  it("has vocabulary matching vocab count", () => {
    expect(lesson.vocabulary).toHaveLength(topic.weeks[0].vocab.length);
  });

  it("has examples", () => {
    expect(lesson.examples.length).toBeGreaterThan(0);
    for (const ex of lesson.examples) {
      expect(ex.jp).toBeTruthy();
      expect(ex.cn).toBeTruthy();
      expect(ex.note).toBeTruthy();
    }
  });

  it("has 8 exercises", () => {
    expect(lesson.exercises).toHaveLength(8);
    for (const ex of lesson.exercises) {
      expect(ex.type).toBeTruthy();
      expect(ex.question).toBeTruthy();
      expect(ex.answer).toBeTruthy();
      expect(ex.analysis).toBeTruthy();
    }
  });

  it("has review items", () => {
    expect(lesson.review).toHaveLength(4);
  });
});

describe("makeChineseMeaning", () => {
  it("returns meaning for known words", () => {
    expect(makeChineseMeaning("私")).toBe("我");
    expect(makeChineseMeaning("日本語")).toBe("日语");
    expect(makeChineseMeaning("食べます")).toBe("吃");
  });

  it("returns fallback for unknown words", () => {
    const result = makeChineseMeaning("存在しない単語");
    expect(result).toBeTruthy();
    expect(result).not.toBe("本周重点词，需结合例句记忆");
  });
});

describe("curriculum", () => {
  it("has 12 months with 48 weeks total", () => {
    expect(curriculum).toHaveLength(12);
    const totalWeeks = curriculum.reduce((sum, m) => sum + m.weeks.length, 0);
    expect(totalWeeks).toBe(48);
  });

  it("each lesson has unique id", () => {
    const ids = new Set<string>();
    for (const month of curriculum) {
      for (const week of month.weeks) {
        expect(ids.has(week.id)).toBe(false);
        ids.add(week.id);
      }
    }
  });

  it("sidebarData has matching structure", () => {
    expect(sidebarData).toHaveLength(12);
    const totalWeeks = sidebarData.reduce((sum, m) => sum + m.weeks.length, 0);
    expect(totalWeeks).toBe(48);
  });

  it("sidebarData ids match curriculum ids", () => {
    for (const month of sidebarData) {
      for (const week of month.weeks) {
        const found = curriculum.some((m) =>
          m.weeks.some((w) => w.id === week.id),
        );
        expect(found).toBe(true);
      }
    }
  });
});
