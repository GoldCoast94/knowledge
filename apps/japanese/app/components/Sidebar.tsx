"use client";

import { Moon, Search, Sun } from "lucide-react";
import type { SidebarMonth } from "@/lib/types";

type Props = {
  curriculum: SidebarMonth[];
  activeId: string;
  query: string;
  progress: Set<string>;
  sidebarOpen: boolean;
  totalWeeks: number;
  theme: "light" | "dark";
  onQueryChange: (q: string) => void;
  onSelectWeek: (id: string) => void;
  onClose: () => void;
  onToggleTheme: () => void;
};

export default function Sidebar({
  curriculum,
  activeId,
  query,
  progress,
  sidebarOpen,
  totalWeeks,
  theme,
  onQueryChange,
  onSelectWeek,
  onClose,
  onToggleTheme,
}: Props) {
  const normalizedQuery = query.trim().toLowerCase();
  const completedCount = curriculum.reduce(
    (sum, m) => sum + m.weeks.filter((w) => progress.has(w.id)).length,
    0,
  );

  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-label="课程菜单">
        <div className="brand">
          <div className="brand-mark">日</div>
          <div>
            <h1>一年到 N1</h1>
            <p>详细讲解 · 练习 · 答案</p>
          </div>
        </div>

        <label className="search-box">
          <Search size={17} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索 N2、敬语、阅读..."
            type="search"
          />
        </label>

        <div className="sidebar-actions">
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            type="button"
            aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(completedCount / totalWeeks) * 100}%` }} />
          <span>{completedCount}/{totalWeeks} 周已完成</span>
        </div>

        <nav className="menu">
          {curriculum.map((month) => {
            const weeks = month.weeks.filter((week) => {
              const text = `${month.title} ${month.level} ${week.title} ${week.focus} ${week.tags.join(" ")}`.toLowerCase();
              return !normalizedQuery || text.includes(normalizedQuery);
            });
            if (!weeks.length) return null;

            return (
              <section className="month-group" key={month.title}>
                <div className="month-title">
                  <span>{month.title}</span>
                  <small>{month.level}</small>
                </div>
                <div className="lesson-list">
                  {weeks.map((week) => (
                    <button
                      className={`lesson-link ${week.id === activeId ? "active" : ""} ${progress.has(week.id) ? "done" : ""}`}
                      key={week.id}
                      onClick={() => {
                        onSelectWeek(week.id);
                        onClose();
                      }}
                      type="button"
                    >
                      <span>{week.title}</span>
                      <small>{week.focus}</small>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </nav>
      </aside>
      {sidebarOpen && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}
    </>
  );
}
