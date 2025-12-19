'use client';

import React from 'react';

type Props = {
  x: number;
  y: number;
  tileSize: number;

  locked: boolean;
  label?: string;

  // hiển thị “LOCK 🔒” kiểu bạn đang có
  showLabel?: boolean;
};

export default function Gate({
  x,
  y,
  tileSize,
  locked,
  label = 'GATE',
  showLabel = true,
}: Props) {
  const px = x * tileSize;
  const py = y * tileSize;

  return (
    <div
      className='absolute select-none'
      style={{
        left: px,
        top: py,
        width: tileSize,
        height: tileSize,
        zIndex: 12,
      }}
    >
      {showLabel && (
        <div className='absolute -top-5 left-0 text-[11px] font-semibold text-white/90 drop-shadow'>
          {label} {locked ? 'LOCK 🔒' : 'OPEN ✅'}
        </div>
      )}

      <div
        className={[
          'relative mx-auto rounded-sm',
          locked ? 'bg-red-500' : 'bg-emerald-500',
          'shadow-[0_0_16px_rgba(16,185,129,0.35)]',
        ].join(' ')}
        style={{
          width: tileSize * 0.72,
          height: tileSize * 0.72,
          marginTop: tileSize * 0.12,
        }}
      >
        <div className='absolute inset-0 grid place-items-center text-[14px]'>
          {locked ? '🔒' : '🚪'}
        </div>
      </div>
    </div>
  );
}
