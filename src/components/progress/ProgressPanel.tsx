'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { achievementLabel, type ChildProgress } from '@/lib/progress';

export default function ProgressPanel({ progress }: { progress: ChildProgress }) {
  const achievements = useMemo(() => {
    return (progress.achievements || []).map((id) => ({ id, ...achievementLabel(id) }));
  }, [progress.achievements]);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur border">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">📊 Thành tích của bé</CardTitle>
          <CardDescription>Theo dõi điểm và huy hiệu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Tổng điểm bài tập: {progress.totalPoints}</Badge>
            <Badge variant="secondary">Streak: {progress.streakDays || 0} ngày 🔥</Badge>
            <Badge variant="secondary">Số bài đã làm: {progress.exerciseHistory.length}</Badge>
          </div>

          <div className="rounded-xl bg-muted/20 p-3">
            <div className="font-semibold text-sm mb-2">🏅 Huy hiệu</div>
            {achievements.length === 0 ? (
              <div className="text-sm text-muted-foreground">Chưa có huy hiệu. Hãy làm bài tập để nhận nhé!</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {achievements.map((a) => (
                  <div key={a.id} className="rounded-lg bg-white/70 border p-3">
                    <div className="font-semibold text-sm">
                      {a.emoji} {a.title}
                    </div>
                    <div className="text-xs text-muted-foreground">{a.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl bg-muted/20 p-3">
            <div className="font-semibold text-sm mb-2">🧾 Lịch sử bài tập</div>
            {progress.exerciseHistory.length === 0 ? (
              <div className="text-sm text-muted-foreground">Chưa có lịch sử.</div>
            ) : (
              <div className="space-y-2">
                {progress.exerciseHistory.slice(0, 6).map((h) => (
                  <div key={h.createdAt} className="flex items-center justify-between text-sm bg-white/70 border rounded-lg p-2">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{h.title}</div>
                      <div className="text-xs text-muted-foreground">{new Date(h.createdAt).toLocaleString()}</div>
                    </div>
                    <Badge variant="outline">{h.score}/{h.maxScore}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
