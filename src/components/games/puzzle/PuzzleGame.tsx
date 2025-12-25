'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Level = 3 | 4 | 5;

function range(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function countInversions(arr: number[]) {
  // arr excludes 0 (blank)
  let inv = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) inv++;
    }
  }
  return inv;
}

/**
 * Solvable rule for N-puzzle:
 * - If grid width is odd: inversions must be even
 * - If grid width is even: (blankRowFromBottom is even) XOR (inversions is even) must be true
 */
function isSolvable(tiles: number[], size: number) {
  const flat = tiles.filter((x) => x !== 0);
  const inv = countInversions(flat);

  if (size % 2 === 1) {
    return inv % 2 === 0;
  }

  const blankIndex = tiles.indexOf(0);
  const blankRowFromTop = Math.floor(blankIndex / size); // 0-based
  const blankRowFromBottom = size - blankRowFromTop; // 1-based

  const blankEven = blankRowFromBottom % 2 === 0;
  const invEven = inv % 2 === 0;

  // XOR
  return blankEven !== invEven;
}

function makeSolved(size: number) {
  // solved: 1..N*N-1 then 0(blank)
  const total = size * size;
  return [...range(total - 1).map((i) => i + 1), 0];
}

function shuffledSolvable(size: number) {
  const solved = makeSolved(size);

  // Fisher–Yates shuffle until solvable & not already solved
  for (let tries = 0; tries < 2000; tries++) {
    const a = [...solved];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    if (a.join(',') !== solved.join(',') && isSolvable(a, size)) return a;
  }

  // fallback (should rarely hit)
  return solved;
}

function neighbors(index: number, size: number) {
  const r = Math.floor(index / size);
  const c = index % size;
  const list: number[] = [];
  if (r > 0) list.push(index - size);
  if (r < size - 1) list.push(index + size);
  if (c > 0) list.push(index - 1);
  if (c < size - 1) list.push(index + 1);
  return list;
}

function getStars(moves: number, timeSec: number, size: number) {
  // tiêu chuẩn đơn giản (bạn có thể tinh chỉnh)
  const base = size === 3 ? 60 : size === 4 ? 120 : 200;
  const fast = size === 3 ? 45 : size === 4 ? 90 : 150;
  const moveGood = base;
  const moveGreat = Math.floor(base * 0.7);

  if (moves <= moveGreat && timeSec <= fast) return 3;
  if (moves <= moveGood && timeSec <= base) return 2;
  return 1;
}

export default function PuzzleGame({ onBack }: { onBack: () => void }) {
  const [level, setLevel] = useState<Level>(3);
  const [tiles, setTiles] = useState<number[]>(() => shuffledSolvable(3));
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  const solved = useMemo(() => makeSolved(level), [level]);
  const isWin = useMemo(() => tiles.every((v, i) => v === solved[i]), [
    tiles,
    solved,
  ]);

  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running || isWin) return;
    tickRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [running, isWin]);

  useEffect(() => {
    if (isWin) setRunning(false);
  }, [isWin]);

  function reset(nextLevel = level) {
    setLevel(nextLevel);
    setTiles(shuffledSolvable(nextLevel));
    setMoves(0);
    setSeconds(0);
    setRunning(true);
  }

  function moveTile(tileIndex: number) {
    if (isWin) return;

    const blankIndex = tiles.indexOf(0);
    const neigh = neighbors(blankIndex, level);

    // chỉ cho phép trượt ô nằm cạnh ô trống
    if (!neigh.includes(tileIndex)) return;

    const copy = [...tiles];
    [copy[blankIndex], copy[tileIndex]] = [copy[tileIndex], copy[blankIndex]];
    setTiles(copy);
    setMoves((m) => m + 1);
    setRunning(true);
  }

  // keyboard support (tăng “feel” game)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isWin) return;
      const blank = tiles.indexOf(0);
      const r = Math.floor(blank / level);
      const c = blank % level;

      let target = -1;
      if (e.key === 'ArrowUp' && r < level - 1) target = blank + level;
      if (e.key === 'ArrowDown' && r > 0) target = blank - level;
      if (e.key === 'ArrowLeft' && c < level - 1) target = blank + 1;
      if (e.key === 'ArrowRight' && c > 0) target = blank - 1;

      if (target >= 0) moveTile(target);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles, level, isWin]);

  const stars = isWin ? getStars(moves, seconds, level) : 0;

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between gap-2'>
        <Button variant='outline' onClick={onBack} className='h-9'>
          ← Quay lại
        </Button>

        <div className='flex items-center gap-2'>
          <Badge variant='secondary'>⏱ {formatTime(seconds)}</Badge>
          <Badge variant='secondary'>👣 {moves} bước</Badge>
        </div>
      </div>

      <Card className='overflow-hidden border bg-gradient-to-br from-white/80 to-white/40 backdrop-blur'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between gap-3'>
            <CardTitle className='text-lg md:text-xl'>
              🧩 Xếp hình trượt (khó hơn)
            </CardTitle>

            <div className='flex gap-2'>
              <Button
                size='sm'
                variant={level === 3 ? 'default' : 'outline'}
                onClick={() => reset(3)}
              >
                3x3
              </Button>
              <Button
                size='sm'
                variant={level === 4 ? 'default' : 'outline'}
                onClick={() => reset(4)}
              >
                4x4
              </Button>
              <Button
                size='sm'
                variant={level === 5 ? 'default' : 'outline'}
                onClick={() => reset(5)}
              >
                5x5
              </Button>
            </div>
          </div>

          <p className='text-sm text-muted-foreground'>
            Mẹo: dùng chuột bấm ô cạnh ô trống để trượt. Có thể dùng phím mũi
            tên.
          </p>
        </CardHeader>

        <CardContent className='space-y-4'>
          <div
            className='grid gap-2 p-3 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-sky-50/60 border'
            style={{ gridTemplateColumns: `repeat(${level}, minmax(0, 1fr))` }}
          >
            {tiles.map((n, idx) => {
              const isBlank = n === 0;
              const correctValue = solved[idx];
              const inRightPlace = !isBlank && n === correctValue;

              return (
                <button
                  key={idx}
                  onClick={() => moveTile(idx)}
                  className={[
                    'aspect-square rounded-2xl border transition-all select-none',
                    'flex items-center justify-center font-extrabold',
                    'active:scale-[0.98]',
                    isBlank
                      ? 'bg-transparent border-dashed border-2 border-emerald-200/70'
                      : 'bg-white/90 hover:bg-white shadow-sm hover:shadow',
                    inRightPlace ? 'ring-2 ring-emerald-400/70' : '',
                  ].join(' ')}
                  style={{
                    fontSize: level === 3 ? 28 : level === 4 ? 20 : 16,
                  }}
                  aria-label={isBlank ? 'blank' : `tile ${n}`}
                >
                  {!isBlank && (
                    <span className='text-emerald-700 drop-shadow-sm'>{n}</span>
                  )}
                </button>
              );
            })}
          </div>

          {isWin && (
            <div className='p-4 rounded-2xl bg-green-100 border text-center space-y-2'>
              <div className='text-lg font-extrabold'>
                🎉 Bạn đã hoàn thành!
              </div>
              <div className='text-sm'>
                Thời gian: <b>{formatTime(seconds)}</b> • Bước: <b>{moves}</b>
              </div>
              <div className='text-2xl'>
                {'⭐'.repeat(stars)}
                <span className='opacity-30'>{'⭐'.repeat(3 - stars)}</span>
              </div>
              <div className='text-sm text-muted-foreground'>
                {stars === 3
                  ? 'Xuất sắc! Rất nhanh và chuẩn!'
                  : stars === 2
                  ? 'Rất tốt! Cố thêm chút để 3 sao nhé!'
                  : 'Hoàn thành tốt! Lần sau thử nhanh hơn nha!'}
              </div>
            </div>
          )}

          <div className='flex gap-2'>
            <Button onClick={() => reset(level)} className='flex-1'>
              🔄 Chơi lại
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                // hint: tự động thực hiện 1 bước hợp lệ ngẫu nhiên để “gợi ý”
                const blank = tiles.indexOf(0);
                const neigh = neighbors(blank, level);
                const pick = neigh[Math.floor(Math.random() * neigh.length)];
                moveTile(pick);
              }}
              className='flex-1'
              disabled={isWin}
            >
              💡 Gợi ý 1 bước
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
