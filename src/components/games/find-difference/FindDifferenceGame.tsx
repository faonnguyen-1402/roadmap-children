'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Level = 'easy' | 'medium' | 'hard';

type Cell = {
  id: string;
  emoji: string;
};

type Round = {
  level: Level;
  size: number; // grid = size x size
  left: Cell[];
  right: Cell[];
  diffIdx: number[]; // indices that differ
};

const POOLS: Record<string, string[]> = {
  fruits: [
    '🍎',
    '🍌',
    '🍇',
    '🍉',
    '🍓',
    '🍒',
    '🍍',
    '🍑',
    '🍐',
    '🥝',
    '🍋',
    '🍊',
  ],
  animals: [
    '🐶',
    '🐱',
    '🐭',
    '🐹',
    '🐰',
    '🦊',
    '🐻',
    '🐼',
    '🐨',
    '🐯',
    '🦁',
    '🐸',
  ],
  food: [
    '🍕',
    '🍔',
    '🍟',
    '🌭',
    '🥪',
    '🍣',
    '🍜',
    '🍙',
    '🥟',
    '🍩',
    '🍪',
    '🍰',
  ],
  faces: [
    '😀',
    '😅',
    '😍',
    '😎',
    '🥳',
    '😴',
    '😡',
    '😭',
    '🤯',
    '🤔',
    '😇',
    '🤩',
  ],
  shapes: [
    '🔴',
    '🟠',
    '🟡',
    '🟢',
    '🔵',
    '🟣',
    '⚫',
    '⚪',
    '🟤',
    '🔺',
    '🔻',
    '⭐',
  ],
};

const SIMILAR_PAIRS: [string, string][] = [
  ['🍋', '🍍'],
  ['🍎', '🍒'],
  ['🍐', '🍏'],
  ['🐯', '🦁'],
  ['🐶', '🐺'],
  ['😀', '😃'],
  ['😅', '😂'],
  ['🔴', '🟠'],
  ['🔺', '🔻'],
  ['⭐', '✨'],
];

// ---- utils ----
function randInt(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickN<T>(arr: T[], n: number) {
  return shuffle(arr).slice(0, n);
}
function uniqueIdx(count: number, n: number) {
  const set = new Set<number>();
  // bảo vệ: tránh loop vô hạn nếu n > count
  const target = Math.min(n, count);
  while (set.size < target) set.add(Math.floor(Math.random() * count));
  return [...set].sort((a, b) => a - b);
}
function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

function getConfig(level: Level) {
  if (level === 'easy')
    return { size: 3, diffs: 2, time: 45, penalty: 2, hints: 1 };
  if (level === 'medium')
    return { size: 4, diffs: 4, time: 70, penalty: 3, hints: 1 };
  return { size: 5, diffs: 6, time: 95, penalty: 4, hints: 2 };
}

/**
 * ✅ FIX chính:
 * - KHÔNG mutate diffIdx trong lúc forEach
 * - swap: ghi nhận luôn cả idx và j vào 1 Set
 * - mọi truy cập right[i] đều được guard an toàn
 */
function buildRound(level: Level): Round {
  const cfg = getConfig(level);
  const total = cfg.size * cfg.size;

  const themeKey = pickN(Object.keys(POOLS), 1)[0] ?? 'fruits';
  const pool = POOLS[themeKey] ?? POOLS.fruits;

  // base left grid
  const base = pickN(pool, total).map((emoji) => ({ id: makeId(), emoji }));

  // right grid starts as clone
  const right = base.map((c) => ({ ...c, id: makeId() }));

  // choose diff indices
  const initial = uniqueIdx(total, cfg.diffs);

  // collect diffs safely
  const diffSet = new Set<number>(initial);

  // apply variety of diff types
  const modes = shuffle(['replace', 'swap', 'similar'] as const);

  for (let k = 0; k < initial.length; k++) {
    const idx = initial[k];
    const mode = modes[k % modes.length];

    // guard
    if (!right[idx]) continue;

    if (mode === 'swap') {
      let j = randInt(0, total - 1);
      while (j === idx) j = randInt(0, total - 1);

      if (!right[j]) continue;

      const tmp = right[idx].emoji;
      right[idx].emoji = right[j].emoji;
      right[j].emoji = tmp;

      // swap tạo khác biệt ở 2 vị trí => add cả 2
      diffSet.add(idx);
      diffSet.add(j);
    } else if (mode === 'similar') {
      const pair = pickN(SIMILAR_PAIRS, 1)[0];
      if (!pair) continue;

      const current = right[idx].emoji;

      if (current === pair[0]) right[idx].emoji = pair[1];
      else if (current === pair[1]) right[idx].emoji = pair[0];
      else right[idx].emoji = Math.random() > 0.5 ? pair[0] : pair[1];

      diffSet.add(idx);
    } else {
      // replace
      const candidates = pool.filter((e) => e !== right[idx].emoji);
      const picked = pickN(candidates.length ? candidates : pool, 1)[0];
      if (picked) right[idx].emoji = picked;

      diffSet.add(idx);
    }
  }

  const uniqDiff = [...diffSet]
    .filter((i) => i >= 0 && i < total)
    .sort((a, b) => a - b);

  return {
    level,
    size: cfg.size,
    left: base,
    right,
    diffIdx: uniqDiff,
  };
}

export default function FindDifferenceGame({ onBack }: { onBack: () => void }) {
  const [level, setLevel] = useState<Level>('easy');
  const [seed, setSeed] = useState(0);
  const [found, setFound] = useState<number[]>([]);
  const [wrong, setWrong] = useState(0);
  const [hintUsed, setHintUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(
    () => getConfig('easy').time
  );
  const [running, setRunning] = useState(true);

  const round = useMemo(() => buildRound(level), [level, seed]);

  const cfg = useMemo(() => getConfig(level), [level]);

  // ✅ FIX timer: dùng useEffect (đúng hook), tránh bug dev/prod
  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) return;

    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, timeLeft]);

  const win = found.length >= round.diffIdx.length && round.diffIdx.length > 0;
  const lose = timeLeft <= 0 && !win;

  const resetRound = () => {
    setFound([]);
    setWrong(0);
    setHintUsed(0);
    setTimeLeft(cfg.time);
    setRunning(true);
    setSeed((s) => s + 1);
  };

  const pick = (i: number) => {
    if (!running || win || lose) return;

    const isDiff = round.diffIdx.includes(i);
    const already = found.includes(i);

    if (isDiff && !already) {
      setFound((prev) => [...prev, i]);
      return;
    }

    if (!isDiff) {
      setWrong((w) => w + 1);
      setTimeLeft((t) => Math.max(0, t - cfg.penalty));
    }
  };

  const useHint = () => {
    if (!running || win || lose) return;
    if (hintUsed >= cfg.hints) return;

    const remaining = round.diffIdx.filter((i) => !found.includes(i));
    if (remaining.length === 0) return;

    const reveal = pickN(remaining, 1)[0];
    if (typeof reveal !== 'number') return;

    setFound((prev) => [...prev, reveal]);
    setHintUsed((h) => h + 1);
  };

  // ✅ Tailwind không build được class động "grid-cols-${n}" nếu n thay đổi.
  // FIX nhỏ: dùng style gridTemplateColumns thay cho class động.
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${round.size}, minmax(0, 1fr))`,
    gap: '0.5rem',
  } as const;

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between gap-2'>
        <Button variant='outline' onClick={onBack}>
          ← Quay lại
        </Button>

        <div className='flex items-center gap-2 flex-wrap justify-end'>
          <Badge variant='secondary'>⏱️ {timeLeft}s</Badge>
          <Badge variant='secondary'>❌ Sai: {wrong}</Badge>
          <Badge variant='secondary'>
            ✅ {Math.min(found.length, round.diffIdx.length)}/
            {round.diffIdx.length}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader className='space-y-3'>
          <div className='flex items-center justify-between gap-2 flex-wrap'>
            <CardTitle>🔍 Tìm điểm khác biệt</CardTitle>
            <div className='flex gap-2'>
              <Button
                variant={level === 'easy' ? 'default' : 'outline'}
                onClick={() => {
                  setLevel('easy');
                  setTimeLeft(getConfig('easy').time);
                  setSeed((s) => s + 1);
                  setFound([]);
                  setWrong(0);
                  setHintUsed(0);
                  setRunning(true);
                }}
              >
                Dễ
              </Button>
              <Button
                variant={level === 'medium' ? 'default' : 'outline'}
                onClick={() => {
                  setLevel('medium');
                  setTimeLeft(getConfig('medium').time);
                  setSeed((s) => s + 1);
                  setFound([]);
                  setWrong(0);
                  setHintUsed(0);
                  setRunning(true);
                }}
              >
                Vừa
              </Button>
              <Button
                variant={level === 'hard' ? 'default' : 'outline'}
                onClick={() => {
                  setLevel('hard');
                  setTimeLeft(getConfig('hard').time);
                  setSeed((s) => s + 1);
                  setFound([]);
                  setWrong(0);
                  setHintUsed(0);
                  setRunning(true);
                }}
              >
                Khó
              </Button>
            </div>
          </div>

          <div className='flex items-center gap-2 flex-wrap'>
            <Button variant='outline' onClick={resetRound}>
              🔁 Ván mới
            </Button>

            <Button
              variant='outline'
              onClick={useHint}
              disabled={hintUsed >= cfg.hints || win || lose}
            >
              💡 Gợi ý ({cfg.hints - hintUsed}/{cfg.hints})
            </Button>

            <Button
              variant='outline'
              onClick={() => setRunning((r) => !r)}
              disabled={win || lose}
            >
              {running ? '⏸️ Tạm dừng' : '▶️ Tiếp tục'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            {/* LEFT */}
            <div style={gridStyle}>
              {round.left.map((c, i) => (
                <div
                  key={c.id}
                  onClick={() => pick(i)}
                  className={[
                    'aspect-square flex items-center justify-center text-3xl',
                    'rounded-xl cursor-pointer select-none',
                    found.includes(i)
                      ? 'bg-green-200'
                      : 'bg-slate-100 hover:bg-slate-200',
                    win ? 'opacity-80' : '',
                  ].join(' ')}
                >
                  {c.emoji}
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div style={gridStyle}>
              {round.right.map((c, i) => (
                <div
                  key={c.id}
                  onClick={() => pick(i)}
                  className={[
                    'aspect-square flex items-center justify-center text-3xl',
                    'rounded-xl cursor-pointer select-none',
                    found.includes(i)
                      ? 'bg-green-200'
                      : 'bg-slate-100 hover:bg-slate-200',
                    win ? 'opacity-80' : '',
                  ].join(' ')}
                >
                  {c.emoji}
                </div>
              ))}
            </div>
          </div>

          {win && (
            <div className='p-3 bg-green-100 rounded-xl text-center font-semibold space-y-2'>
              <div>🎉 Bạn đã tìm đủ điểm khác biệt!</div>
              <div className='text-sm font-normal'>
                Thời gian còn lại: <b>{timeLeft}s</b> • Sai: <b>{wrong}</b>
              </div>
              <div className='flex justify-center gap-2 flex-wrap'>
                <Button onClick={resetRound}>Chơi lại (ván mới)</Button>
                <Button variant='outline' onClick={onBack}>
                  Về màn trò chơi
                </Button>
              </div>
            </div>
          )}

          {lose && (
            <div className='p-3 bg-rose-100 rounded-xl text-center font-semibold space-y-2'>
              <div>⏳ Hết giờ rồi!</div>
              <div className='text-sm font-normal'>
                Bạn đã tìm được <b>{found.length}</b> /{' '}
                <b>{round.diffIdx.length}</b> điểm khác biệt.
              </div>
              <div className='flex justify-center gap-2 flex-wrap'>
                <Button onClick={resetRound}>Thử lại</Button>
                <Button
                  variant='outline'
                  onClick={useHint}
                  disabled={hintUsed >= cfg.hints}
                >
                  Dùng gợi ý
                </Button>
              </div>
            </div>
          )}

          {!win && !lose && (
            <div className='text-xs text-muted-foreground'>
              Mẹo: Có thể khác nhau do <b>đổi emoji</b>, <b>đổi vị trí</b>, hoặc{' '}
              <b>emoji gần giống</b>. Click sai sẽ bị trừ {cfg.penalty}s.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
