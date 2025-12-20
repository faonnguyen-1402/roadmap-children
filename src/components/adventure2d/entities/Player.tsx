'use client';

import React from 'react';

export type Facing = 'up' | 'down' | 'left' | 'right';

export type PlayerStats = {
  hp: number;
  maxHp: number;
  atk: number;
  iq: number; // điểm tư duy
  empathy: number; // điểm ứng xử
  coin: number;
};

type Props = {
  x: number; // tile X
  y: number; // tile Y
  tileSize: number;
  label?: string;

  facing?: Facing;
  isMoving?: boolean;

  stats?: PlayerStats;

  // hiệu ứng nhẹ cho trẻ: glow khi lên cấp / đúng quiz
  aura?: 'none' | 'iq' | 'empathy' | 'power';
};

export default function Player({
  x,
  y,
  tileSize,
  label = 'YOU',
  facing = 'down',
  isMoving = false,
  stats,
  aura = 'none',
}: Props) {
  const px = x * tileSize;
  const py = y * tileSize;

  const auraClass =
    aura === 'iq'
      ? 'shadow-[0_0_18px_rgba(59,130,246,0.9)]'
      : aura === 'empathy'
      ? 'shadow-[0_0_18px_rgba(236,72,153,0.9)]'
      : aura === 'power'
      ? 'shadow-[0_0_18px_rgba(34,197,94,0.9)]'
      : 'shadow-[0_0_0px_rgba(0,0,0,0)]';

  const bob = isMoving ? 'animate-[playerBob_.35s_ease-in-out_infinite]' : '';

  const arrowRotation =
    facing === 'up'
      ? '-rotate-90'
      : facing === 'down'
      ? 'rotate-90'
      : facing === 'left'
      ? 'rotate-180'
      : 'rotate-0';

  return (
    <div
      className='absolute select-none'
      style={{
        left: px,
        top: py,
        width: tileSize,
        height: tileSize,
        zIndex: 20,
      }}
    >
      {/* name */}
      <div className='absolute -top-5 left-0 text-[11px] font-semibold text-white/90 drop-shadow'>
        {label}
      </div>

      {/* body */}
      <div
        className={[
          'relative mx-auto rounded-full bg-violet-400',
          auraClass,
          bob,
        ].join(' ')}
        style={{
          width: tileSize * 0.72,
          height: tileSize * 0.72,
          marginTop: tileSize * 0.12,
        }}
      >
        {/* tiny face direction */}
        <div
          className={[
            'absolute right-1 top-1 text-[10px] text-black/70',
            arrowRotation,
          ].join(' ')}
          title='Facing'
        >
          ►
        </div>
      </div>

      {/* tiny stats chip (optional) */}
      {stats && (
        <div className='absolute -bottom-5 left-0 flex gap-1 text-[10px] text-white/85'>
          <span className='px-1 rounded bg-black/35'>HP {stats.hp}</span>
          <span className='px-1 rounded bg-black/35'>ATK {stats.atk}</span>
        </div>
      )}

      <style jsx>{`
        @keyframes playerBob {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </div>
  );
}
