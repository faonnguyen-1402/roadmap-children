'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { SKILL_VIDEOS, type SkillVideo } from '@/lib/skills-videos';
import { loadFavorites, toggleFavorite } from '@/lib/favorites';
import { completeVideo, loadSkillProgress } from '@/lib/skills-progress';
import { pushNotification } from '@/lib/notifications';

export default function SkillsVideoHub({
  userId,
  onBack,
}: {
  userId: string;
  onBack: () => void;
}) {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<'all' | SkillVideo['category']>('all');
  const [level, setLevel] = useState<'all' | SkillVideo['level']>('all');

  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites(userId));
  const [progress, setProgress] = useState(() => loadSkillProgress(userId));

  const [selected, setSelected] = useState<SkillVideo | null>(SKILL_VIDEOS[0] || null);

  const list = useMemo(() => {
    return SKILL_VIDEOS.filter((v) => {
      const okQ =
        v.title.toLowerCase().includes(query.toLowerCase()) ||
        v.description.toLowerCase().includes(query.toLowerCase());
      const okC = cat === 'all' ? true : v.category === cat;
      const okL = level === 'all' ? true : v.level === level;
      return okQ && okC && okL;
    });
  }, [query, cat, level]);

  const isFav = (id: string) => favorites.includes(id);
  const isDone = (id: string) => progress.completedVideoIds.includes(id);

  const handleToggleFav = (id: string) => {
    const next = toggleFavorite(userId, id);
    setFavorites(next);
  };

  const handleComplete = (v: SkillVideo) => {
    const next = completeVideo(userId, v.id);
    setProgress(next);

    // ✅ DES-27: push notification
    pushNotification(userId, {
      type: 'course_complete',
      title: '🎉 Hoàn thành khóa học',
      message: `Bạn đã hoàn thành: "${v.title}"`,
      createdAt: new Date().toISOString(),
    });
  };

  const favoritesList = useMemo(
    () => SKILL_VIDEOS.filter((v) => favorites.includes(v.id)),
    [favorites]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Button variant="outline" onClick={onBack}>
          ← Quay lại
        </Button>
        <Badge variant="secondary">
          ✅ Đã hoàn thành: {progress.completedVideoIds.length}/{SKILL_VIDEOS.length}
        </Badge>
      </div>

      <Card className="bg-gradient-to-br from-sky-50 to-indigo-50">
        <CardHeader className="space-y-2">
          <CardTitle>🎥 Video kỹ năng</CardTitle>
          <CardDescription>
            Xem video – lưu yêu thích – đánh dấu hoàn thành để nhận thông báo.
          </CardDescription>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              className="w-full px-3 py-2 rounded-lg border bg-white/80 text-sm"
              placeholder="Tìm video..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <select
              className="w-full px-3 py-2 rounded-lg border bg-white/80 text-sm"
              value={cat}
              onChange={(e) => setCat(e.target.value as any)}
            >
              <option value="all">Tất cả chủ đề</option>
              <option value="Giao tiếp">Giao tiếp</option>
              <option value="Tự lập">Tự lập</option>
              <option value="Kỷ luật">Kỷ luật</option>
              <option value="Cảm xúc">Cảm xúc</option>
              <option value="Học tập">Học tập</option>
            </select>

            <select
              className="w-full px-3 py-2 rounded-lg border bg-white/80 text-sm"
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
            >
              <option value="all">Tất cả độ khó</option>
              <option value="Dễ">Dễ</option>
              <option value="Vừa">Vừa</option>
              <option value="Khó">Khó</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LEFT: List */}
          <div className="space-y-3">
            <div className="text-sm font-semibold">📚 Danh sách</div>

            {list.map((v) => (
              <div
                key={v.id}
                className={[
                  'p-3 rounded-xl border bg-white/80 cursor-pointer',
                  selected?.id === v.id ? 'border-primary' : 'border-transparent',
                ].join(' ')}
                onClick={() => setSelected(v)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">{v.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{v.description}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="secondary" className="text-[10px]">{v.category}</Badge>
                    <Badge variant="outline" className="text-[10px]">{v.level}</Badge>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="text-[11px] text-muted-foreground">⏱ {v.durationMin} phút</div>
                  <div className="flex gap-2">
                    <Button
                      variant={isFav(v.id) ? 'default' : 'outline'}
                      className="h-8 px-3 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFav(v.id);
                      }}
                    >
                      {isFav(v.id) ? '★ Đã thích' : '☆ Yêu thích'}
                    </Button>
                  </div>
                </div>

                {isDone(v.id) && (
                  <div className="mt-2 text-[11px] font-semibold text-green-700">
                    ✅ Đã hoàn thành
                  </div>
                )}
              </div>
            ))}

            <Card className="bg-white/70">
              <CardHeader className="py-3">
                <CardTitle className="text-sm">❤️ Khóa học yêu thích</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {favoritesList.length === 0 && (
                  <div className="text-xs text-muted-foreground">Chưa có khóa học yêu thích.</div>
                )}
                {favoritesList.map((v) => (
                  <div
                    key={v.id}
                    className="text-sm p-2 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100"
                    onClick={() => setSelected(v)}
                  >
                    {v.title}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Player */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-sm font-semibold">▶️ Trình phát</div>

            {!selected ? (
              <div className="p-6 rounded-xl bg-white/70 text-sm text-muted-foreground">
                Hãy chọn 1 video để xem.
              </div>
            ) : (
              <Card className="bg-white/70 overflow-hidden">
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-base">{selected.title}</CardTitle>
                      <CardDescription className="text-sm">{selected.description}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="secondary">{selected.category}</Badge>
                      <Badge variant="outline">{selected.level}</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={isFav(selected.id) ? 'default' : 'outline'}
                      className="h-9"
                      onClick={() => handleToggleFav(selected.id)}
                    >
                      {isFav(selected.id) ? '★ Đã thích' : '☆ Yêu thích'}
                    </Button>

                    <Button
                      className="h-9"
                      disabled={isDone(selected.id)}
                      onClick={() => handleComplete(selected)}
                    >
                      {isDone(selected.id) ? '✅ Đã hoàn thành' : '✅ Đánh dấu hoàn thành'}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {selected.type === 'youtube' ? (
                    <div className="aspect-video rounded-xl overflow-hidden bg-black">
                      <iframe
                        className="w-full h-full"
                        src={selected.url}
                        title={selected.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <video className="w-full rounded-xl" controls src={selected.url} />
                  )}

                  
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
