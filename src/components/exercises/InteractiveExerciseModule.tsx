'use client';

import React, { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EXERCISES, type Exercise } from './exerciseBank';

export default function InteractiveExerciseModule({
  onBack,
  onFinish,
}: {
  onBack: () => void;
  onFinish: (result: {
    score: number;
    maxScore: number;
    title: string;
    id: string;
  }) => void;
}) {
  const QUESTIONS_PER_RUN = 10;

  const list = useMemo(() => {
    // ✅ lấy ngẫu nhiên 10 bài mỗi lần (nếu ngân hàng ít hơn 10 thì lấy tối đa)
    const shuffled = [...EXERCISES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(QUESTIONS_PER_RUN, shuffled.length));
  }, []);

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const ex: Exercise = list[idx];
  const maxScore = list.reduce((a, b) => a + b.points, 0);

  const pick = (optId: string) => {
    if (picked) return;
    setPicked(optId);

    const opt = ex.options.find((o) => o.id === optId);
    const ok = !!opt?.correct;

    if (ok) setScore((s) => s + ex.points);

    setFeedback(opt?.feedback || (ok ? 'Đúng!' : 'Chưa đúng.'));
  };

  const next = () => {
    if (idx < list.length - 1) {
      setIdx((i) => i + 1);
      setPicked(null);
      setFeedback(null);
      return;
    }
    // finish
    onFinish({
      score,
      maxScore,
      title: 'Bài tập tương tác',
      id: `module_${Date.now()}`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" onClick={onBack} className="h-9">
          ← Quay lại
        </Button>

        <Badge variant="secondary" className="text-xs">
          Câu {idx + 1}/{list.length}
        </Badge>
      </div>

      <Card className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur border">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">{ex.title}</CardTitle>
          <CardDescription className="text-sm">{ex.prompt}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {ex.options.map((o) => {
            const selected = picked === o.id;
            const correct = !!o.correct;
            const showState = !!picked;

            const cls =
              'w-full justify-start h-auto whitespace-normal text-left p-4 ' +
              (showState && selected && correct
                ? 'border-emerald-400 bg-emerald-50'
                : '') +
              (showState && selected && !correct
                ? 'border-rose-400 bg-rose-50'
                : '');

            return (
              <Button
                key={o.id}
                variant="outline"
                className={cls}
                onClick={() => pick(o.id)}
              >
                {o.text}
              </Button>
            );
          })}

          {feedback && (
            <div className="rounded-xl bg-muted/30 p-3 text-sm">{feedback}</div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm">
              Điểm: <span className="font-semibold">{score}</span> / {maxScore}
            </div>

            <Button onClick={next} disabled={!picked}>
              {idx < list.length - 1 ? 'Câu tiếp' : 'Hoàn thành'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
