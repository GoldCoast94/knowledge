import { topics } from "./data";
import { buildLesson } from "./utils";
import type { Month } from "./types";

export type { Exercise, Lesson, Month, Topic, TopicWeek, SidebarMonth, SidebarWeek, Dialogue, ReadingPassage } from "./types";
import type { SidebarMonth } from "./types";

export const curriculum: Month[] = topics.map((topic, monthIndex) => ({
  month: monthIndex + 1,
  level: topic.level,
  title: `第 ${monthIndex + 1} 月：${topic.monthTitle}`,
  goal: topic.monthGoal,
  weeks: topic.weeks.map((week, weekIndex) =>
    buildLesson(monthIndex + 1, weekIndex + 1, topic, week),
  ),
}));

export const sidebarData: SidebarMonth[] = topics.map((topic, monthIndex) => ({
  title: `第 ${monthIndex + 1} 月：${topic.monthTitle}`,
  level: topic.level,
  weeks: topic.weeks.map((week, weekIndex) => ({
    id: `m${monthIndex + 1}-w${weekIndex + 1}`,
    title: week.title,
    focus: week.focus,
    tags: week.tags,
  })),
}));

export const yearRoadmap = [
  "第 1-2 月完成 N5：假名、基础助词、礼貌体、形容词、て形和生活表达。",
  "第 3-4 月完成 N4：普通形、连接、可能、经验、意志、授受，开始写短文。",
  "第 5-6 月完成 N3：条件、推量、使役、被动、敬语入门和中级阅读结构。",
  "第 7-8 月完成 N2：抽象语法、书面语、观点表达、长阅读逻辑。",
  "第 9-10 月进入 N1：新闻、评论、文学随笔、高级词汇与高级句型。",
  "第 11-12 月冲刺 N1：真题、模考、错题地图、速度和心理稳定。",
];
