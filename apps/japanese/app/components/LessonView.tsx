"use client";

import { BookOpen, CheckCircle2, Clock, Menu, Target } from "lucide-react";
import type { Month, Lesson } from "@/lib/types";
import { yearRoadmap } from "@/lib/curriculum";
import Roadmap from "./Roadmap";
import InfoCard from "./InfoCard";
import Exercises from "./Exercises";
import Flashcards from "./Flashcards";
import { DataTable } from "./Shared";

type Props = {
  month: Month;
  lesson: Lesson;
  curriculum: Month[];
  onToggleProgress: (id: string) => void;
  isCompleted: boolean;
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
};

export default function LessonView({
  month,
  lesson,
  curriculum,
  onToggleProgress,
  isCompleted,
  sidebarOpen,
  onOpenSidebar,
}: Props) {
  return (
    <main className="content">
      <header className="topbar">
        <button className="icon-button" onClick={onOpenSidebar} type="button" aria-label="打开菜单">
          <Menu size={20} />
        </button>
        <div className="title-block">
          <span className="pill">{month.level}</span>
          <h2>{lesson.title}</h2>
          <p>{month.goal}</p>
        </div>
        <div className="stats" aria-label="课程统计">
          <span>{curriculum.length} 个月</span>
          <span>{curriculum.reduce((sum, m) => sum + m.weeks.length, 0)} 周</span>
          <span>N5 → N1</span>
        </div>
      </header>

      <Roadmap items={yearRoadmap} />

      <section className="overview-grid">
        <InfoCard icon={<Target size={20} />} title="本周重点" text={lesson.focus} />
        <InfoCard icon={<Clock size={20} />} title="建议时间" text={lesson.time} />
        <InfoCard icon={<BookOpen size={20} />} title="学习方法" text={lesson.method} />
        <InfoCard icon={<CheckCircle2 size={20} />} title="输出任务" text={lesson.objectives.at(-1) ?? lesson.objectives[0]} />
      </section>

      <article className="section">
        <h3>学习目标</h3>
        <ul>
          {lesson.objectives.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="tag-row">
          {lesson.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
          <button
            className={`progress-toggle ${isCompleted ? "completed" : ""}`}
            onClick={() => onToggleProgress(lesson.id)}
            type="button"
          >
            {isCompleted ? "✓ 已完成" : "标记完成"}
          </button>
        </div>
      </article>

      <article className="section">
        <h3>详细讲解</h3>
        {lesson.explain.map((block) => (
          <div key={block.title}>
            <h4>{block.title}</h4>
            {block.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ))}
        <DataTable headers={["项目", "说明", "例句"]} rows={lesson.patterns} />
      </article>

      <article className="section">
        <h3>词汇与表达</h3>
        <DataTable headers={["日语", "读音", "中文", "用法提示"]} rows={lesson.vocabulary} />
      </article>

      <Flashcards
        cards={lesson.vocabulary.map(([word, reading, meaning, usage]) => ({
          word,
          reading,
          meaning,
          usage,
        }))}
      />

      <article className="section">
        <h3>例句精读</h3>
        <div className="example-list">
          {lesson.examples.map((example) => (
            <section className="example" key={example.jp}>
              <p className="jp">{example.jp}</p>
              <p>{example.cn}</p>
              <p>
                <strong>拆解：</strong>
                {example.note}
              </p>
            </section>
          ))}
        </div>
      </article>

      <Exercises exercises={lesson.exercises} lessonId={lesson.id} />

      <article className="section">
        <h3>复习任务</h3>
        <ul>
          {lesson.review.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </main>
  );
}
