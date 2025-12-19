'use client';

import React, { useEffect, useMemo, useState } from 'react';

export type QuizType = 'MATH' | 'SOCIAL';

export type QuizQuestion = {
  id: string;
  type: QuizType;
  title?: string; // optional: "Câu đố tư duy" / "Tình huống ứng xử"
  question: string;
  options: string[];
  answer: string;

  // thưởng sau khi đúng
  reward?: Partial<{
    hp: number;
    maxHp: number;
    atk: number;
    iq: number;
    empathy: number;
  }>;
};

type Props = {
  open: boolean;
  questions: QuizQuestion[];

  // mô tả theo chapter, npc, v.v.
  contextLabel?: string; // ví dụ: "Gặp bạn nhỏ đang cần giúp đỡ"

  // gọi khi đóng modal (ESC / nút)
  onClose: () => void;

  // đúng/sai
  onCorrect: (q: QuizQuestion) => void;
  onWrong?: (q: QuizQuestion, chosen: string) => void;

  // cấu hình: random hay theo index
  mode?: 'RANDOM' | 'SEQUENTIAL';
  startIndex?: number;

  // nếu muốn hạn chế trẻ bấm loạn
  lockAfterAnswerMs?: number; // default 650ms
};

export default function QuizModal({
  open,
  questions,
  contextLabel,
  onClose,
  onCorrect,
  onWrong,
  mode = 'RANDOM',
  startIndex = 0,
  lockAfterAnswerMs = 650,
}: Props) {
  const [idx, setIdx] = useState(startIndex);
  const [chosen, setChosen] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [lock, setLock] = useState(false);

  const q = useMemo(() => {
    if (!questions?.length) return null;
    if (mode === 'SEQUENTIAL')
      return questions[Math.max(0, Math.min(idx, questions.length - 1))];
    // RANDOM:
    const pick = Math.floor(Math.random() * questions.length);
    return questions[pick];
  }, [questions, mode, idx]);

  useEffect(() => {
    if (!open) return;
    setChosen(null);
    setStatus('idle');
    setLock(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !q) return null;

  const isMath = q.type === 'MATH';
  const header =
    q.title ?? (isMath ? '🧠 Câu đố tư duy' : '❤️ Tình huống ứng xử');

  const handlePick = (opt: string) => {
    if (lock) return;
    setLock(true);
    setChosen(opt);

    const ok = opt === q.answer;
    setStatus(ok ? 'correct' : 'wrong');

    if (ok) {
      // feedback nhẹ + thưởng
      setTimeout(() => {
        onCorrect(q);
        onClose();
      }, lockAfterAnswerMs);
    } else {
      onWrong?.(q, opt);
      // cho trẻ nhìn đáp án đúng
      setTimeout(() => {
        setLock(false);
        setChosen(null);
        setStatus('idle');

        // nếu SEQUENTIAL thì next question (tuỳ bạn)
        if (mode === 'SEQUENTIAL') {
          setIdx((v) => Math.min(v + 1, questions.length - 1));
        }
      }, 900);
    }
  };

  const boxRing =
    status === 'correct'
      ? 'ring-2 ring-emerald-400'
      : status === 'wrong'
      ? 'ring-2 ring-rose-400'
      : 'ring-1 ring-white/15';

  return (
    <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4'>
      <div
        className={`w-full max-w-md rounded-2xl bg-slate-950 text-white shadow-xl ${boxRing}`}
      >
        <div className='p-4 border-b border-white/10'>
          <div className='text-xs text-white/60 mb-1'>
            {contextLabel ?? 'Nhiệm vụ'}
          </div>
          <div className='text-lg font-semibold'>{header}</div>
          <div className='mt-2 text-sm text-white/85 leading-relaxed'>
            {q.question}
          </div>
        </div>

        <div className='p-4 space-y-2'>
          {q.options.map((opt) => {
            const isChosen = chosen === opt;
            const isAnswer = opt === q.answer;

            const style =
              status === 'idle'
                ? 'border-white/15 hover:border-white/35 hover:bg-white/5'
                : status === 'correct'
                ? isChosen
                  ? 'border-emerald-400 bg-emerald-400/10'
                  : 'border-white/10 opacity-70'
                : // wrong
                isAnswer
                ? 'border-emerald-400 bg-emerald-400/10'
                : isChosen
                ? 'border-rose-400 bg-rose-400/10'
                : 'border-white/10 opacity-60';

            return (
              <button
                key={opt}
                onClick={() => handlePick(opt)}
                className={`w-full text-left rounded-xl px-3 py-2 border transition ${style}`}
                disabled={lock}
              >
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-sm'>{opt}</span>
                  {status !== 'idle' && isAnswer && (
                    <span className='text-xs text-emerald-300'>
                      Đáp án đúng
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className='px-4 pb-4 flex items-center justify-between'>
          <div className='text-xs text-white/55'>
            Tip: chọn đáp án đúng để tăng sức mạnh ✨
          </div>
          <button
            onClick={onClose}
            className='text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10'
          >
            Đóng (ESC)
          </button>
        </div>
      </div>
    </div>
  );
}
