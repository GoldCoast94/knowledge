"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "japanese-study-progress";

function loadProgress(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveProgress(progress: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...progress]));
  } catch {
    // storage full or unavailable
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Set<string>>(new Set());

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const toggle = useCallback((id: string) => {
    setProgress((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveProgress(next);
      return next;
    });
  }, []);

  const has = useCallback(
    (id: string) => progress.has(id),
    [progress],
  );

  return { progress, toggle, has };
}
