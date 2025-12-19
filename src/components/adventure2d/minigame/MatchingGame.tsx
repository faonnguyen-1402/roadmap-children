'use client';
import { useEffect, useState } from 'react';

const ICONS = ['🔥', '💎', '⚡', '❄️', '🍀', '🧠'];

export default function MatchingGame({
  onWin,
  onLose,
}: {
  onWin: () => void;
  onLose: () => void;
}) {
  const [cards, setCards] = useState<string[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [time, setTime] = useState(15);

  useEffect(() => {
    const deck = [...ICONS, ...ICONS].sort(() => Math.random() - 0.5);
    setCards(deck);
  }, []);

  useEffect(() => {
    if (time <= 0) onLose();
    const t = setInterval(() => setTime((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [time]);

  function click(i: number) {
    if (open.includes(i) || open.length === 2) return;
    const n = [...open, i];
    setOpen(n);

    if (n.length === 2) {
      setTimeout(() => {
        if (cards[n[0]] === cards[n[1]]) {
          setCards((c) =>
            c.map((v, idx) => (idx === n[0] || idx === n[1] ? '✔️' : v))
          );
        }
        setOpen([]);
      }, 500);
    }
  }

  useEffect(() => {
    if (cards.length && cards.every((c) => c === '✔️')) onWin();
  }, [cards]);

  return (
    <div className='absolute inset-0 bg-black/70 flex items-center justify-center'>
      <div className='bg-white p-4 rounded-xl w-[320px]'>
        <div className='mb-2 font-bold'>⏱ {time}s</div>
        <div className='grid grid-cols-4 gap-2'>
          {cards.map((c, i) => (
            <button
              key={i}
              className='h-14 text-2xl border rounded'
              onClick={() => click(i)}
            >
              {open.includes(i) || c === '✔️' ? c : '❓'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
