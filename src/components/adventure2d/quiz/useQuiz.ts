import { useMemo, useState } from 'react';
import type { QuizQuestion } from './QuizModal';

export function useQuizBank(all: QuizQuestion[]) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  const remaining = useMemo(() => all.filter((q) => !done[q.id]), [all, done]);

  const total = all.length;
  const completedCount = total - remaining.length;

  function pickRandom() {
    if (remaining.length === 0) return null;
    const idx = Math.floor(Math.random() * remaining.length);
    return remaining[idx];
  }

  function markDone(id: string) {
    setDone((prev) => ({ ...prev, [id]: true }));
  }

  function reset() {
    setDone({});
  }

  return {
    total,
    completedCount,
    remaining,
    pickRandom,
    markDone,
    reset,
    doneMap: done,
  };
}
