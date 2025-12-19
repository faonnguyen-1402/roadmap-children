'use client';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Clock, Target } from 'lucide-react';
import styles from './MatchingColorGame.module.scss';

const COLORS = [
  { id: 1, color: 'bg-red-400', label: '🔴' },
  { id: 2, color: 'bg-blue-400', label: '🔵' },
  { id: 3, color: 'bg-green-400', label: '🟢' },
  { id: 4, color: 'bg-yellow-400', label: '🟡' },
  { id: 5, color: 'bg-purple-400', label: '🟣' },
  { id: 6, color: 'bg-pink-400', label: '🩷' },
];

type CardType = {
  uid: string;
  id: number;
  color: string;
  label: string;
  matched: boolean;
};

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

type GameStatus = 'PLAYING' | 'WIN' | 'LOSE';

export default function MatchingColorGame({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [opened, setOpened] = useState<CardType[]>([]);
  const [locked, setLocked] = useState(false);

  const [time, setTime] = useState(30);
  const [moves, setMoves] = useState(0);

  // init game
  useEffect(() => {
    const deck = shuffle(
      [...COLORS, ...COLORS].map((c, i) => ({
        ...c,
        uid: `${c.id}-${i}-${Math.random()}`,
        matched: false,
      }))
    );
    setCards(deck);
    setOpened([]);
    setLocked(false);
    setMoves(0);
    setTime(30);
  }, []);

  const finished = useMemo(
    () => cards.length > 0 && cards.every((c) => c.matched),
    [cards]
  );

  const status: GameStatus = useMemo(() => {
    if (finished) return 'WIN';
    if (time <= 0) return 'LOSE';
    return 'PLAYING';
  }, [finished, time]);

  // ✅ timer: chỉ chạy khi PLAYING (và có bài)
  useEffect(() => {
    if (status !== 'PLAYING') return;
    if (cards.length === 0) return;

    const t = setInterval(() => {
      setTime((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(t);
  }, [status, cards.length]);

  const clickCard = (card: CardType) => {
    if (status !== 'PLAYING') return;
    if (locked || card.matched) return;
    if (opened.find((o) => o.uid === card.uid)) return;

    const newOpened = [...opened, card];
    setOpened(newOpened);

    if (newOpened.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);

      setTimeout(() => {
        const [a, b] = newOpened;
        if (a.id === b.id) {
          setCards((prev) =>
            prev.map((c) => (c.id === a.id ? { ...c, matched: true } : c))
          );
        }
        setOpened([]);
        setLocked(false);
      }, 500);
    }
  };

  const statusBadge = () => {
    if (status === 'WIN')
      return (
        <div className='px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700'>
          ✅ WIN
        </div>
      );
    if (status === 'LOSE')
      return (
        <div className='px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700'>
          ❌ LOSE
        </div>
      );
    return (
      <div className='px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700'>
        🎮 PLAYING
      </div>
    );
  };

  return (
    <div className='max-w-3xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <Button variant='outline' onClick={onBack}>
          ← Quay lại
        </Button>

        <div className={`${styles.statusGame} flex items-center gap-3`}>
          {statusBadge()}
          <Card className='px-3 py-1 flex items-center gap-1'>
            <Clock className='w-4 h-4' />
            {time}s
          </Card>
          <Card className='px-3 py-1 flex items-center gap-1'>
            <Target className='w-4 h-4' />
            {moves} lượt
          </Card>
        </div>
      </div>

      {/* Board */}
      <div className='grid grid-cols-4 gap-4'>
        {cards.map((card) => {
          const openedNow =
            opened.some((o) => o.uid === card.uid) || card.matched;

          return (
            <motion.div
              key={card.uid}
              whileTap={{ scale: 0.95 }}
              onClick={() => clickCard(card)}
              className={`cursor-pointer ${
                status !== 'PLAYING' ? 'pointer-events-none opacity-95' : ''
              }`}
            >
              <div
                className={`aspect-square rounded-xl flex items-center justify-center text-3xl
                transition-all duration-300
                ${openedNow ? `${card.color} text-white` : 'bg-slate-300'}`}
              >
                {openedNow ? card.label : '❓'}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Result */}
      {status !== 'PLAYING' && (
        <Card className='p-6 text-center'>
          <h3 className='text-2xl font-bold mb-2'>
            {status === 'WIN' ? '🎉 Hoàn thành!' : '⏰ Hết giờ!'}
          </h3>
          <p>Số lượt: {moves}</p>
          <Button className='mt-4' onClick={onBack}>
            Quay lại
          </Button>
        </Card>
      )}
    </div>
  );
}
