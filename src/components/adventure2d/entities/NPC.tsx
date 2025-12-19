'use client';

import React from 'react';

export type NPCMood = 'neutral' | 'happy' | 'thinking' | 'sad';

type Props = {
  x: number;
  y: number;
  tileSize: number;
  label?: string;

  // để bạn gắn logic: nếu đã hỏi rồi thì đổi mood
  mood?: NPCMood;

  // gợi ý tương tác (E)
  hintKey?: string; // default "E"
  showHint?: boolean;
};

export default function NPC({
  x,
  y,
  tileSize,
  label = 'NPC',
  mood = 'thinking',
  hintKey = 'E',
  showHint = true,
}: Props) {
  const px = x * tileSize;
  const py = y * tileSize;

  const moodColor =
    mood === 'happy'
      ? 'bg-emerald-400'
      : mood === 'sad'
      ? 'bg-slate-400'
      : mood === 'neutral'
      ? 'bg-sky-400'
      : 'bg-blue-400';

  const moodIcon =
    mood === 'happy'
      ? '😊'
      : mood === 'sad'
      ? '😢'
      : mood === 'neutral'
      ? '🙂'
      : '🤔';

  return (
    <div
      className='absolute select-none'
      style={{
        left: px,
        top: py,
        width: tileSize,
        height: tileSize,
        zIndex: 15,
      }}
    >
      <div className='absolute -top-5 left-0 text-[11px] font-semibold text-white/90 drop-shadow'>
        {label}
      </div>

      <div
        className={[
          'relative mx-auto rounded-full',
          moodColor,
          'shadow-[0_0_14px_rgba(59,130,246,0.45)]',
        ].join(' ')}
        style={{
          width: tileSize * 0.72,
          height: tileSize * 0.72,
          marginTop: tileSize * 0.12,
        }}
      >
        <div className='absolute inset-0 grid place-items-center text-[14px]'>
          {moodIcon}
        </div>
      </div>

      {showHint && (
        <div className='absolute -bottom-6 left-0 text-[10px] text-white/85'>
          <span className='px-1 rounded bg-black/35'>Nhấn {hintKey}</span>
        </div>
      )}
    </div>
  );
}
