"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { curriculum, sidebarData } from "@/lib/curriculum";
import Sidebar from "../components/Sidebar";
import LessonView from "../components/LessonView";
import SakuraAtmosphere from "../components/Shared";
import { useProgress } from "../useProgress";
import { useTheme } from "../useTheme";

function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { progress, toggle: toggleProgress, has: isCompleted } = useProgress();
  const { theme, toggle: toggleTheme } = useTheme();

  const activeId = searchParams.get("week") ?? curriculum[0].weeks[0].id;
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const active = useMemo(() => {
    for (const month of curriculum) {
      const lesson = month.weeks.find((week) => week.id === activeId);
      if (lesson) return { month, lesson };
    }
    return { month: curriculum[0], lesson: curriculum[0].weeks[0] };
  }, [activeId]);

  const totalWeeks = useMemo(
    () => curriculum.reduce((sum, month: any) => sum + month.weeks.length, 0),
    []
  );

  const selectWeek = useCallback(
    (id: string) => {
      router.replace(`/?week=${id}`, { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    const exists = curriculum.some((m) =>
      m.weeks.some((w) => w.id === activeId)
    );
    if (!exists) {
      router.replace(`/?week=${curriculum[0].weeks[0].id}`, { scroll: false });
    }
  }, [activeId, router]);

  return (
    <div className="app-shell">
      <SakuraAtmosphere />
      <Sidebar
        curriculum={sidebarData}
        activeId={activeId}
        query={query}
        progress={progress}
        sidebarOpen={sidebarOpen}
        totalWeeks={totalWeeks}
        theme={theme}
        onQueryChange={setQuery}
        onSelectWeek={selectWeek}
        onClose={() => setSidebarOpen(false)}
        onToggleTheme={toggleTheme}
      />
      <LessonView
        month={active.month}
        lesson={active.lesson}
        curriculum={curriculum}
        onToggleProgress={toggleProgress}
        isCompleted={isCompleted(active.lesson.id)}
        sidebarOpen={sidebarOpen}
        onOpenSidebar={() => setSidebarOpen(true)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="loading-fallback" />}>
      <HomePage />
    </Suspense>
  );
}
