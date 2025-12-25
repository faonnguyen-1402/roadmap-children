'use client';

import React from 'react';
import { useScreenTime } from './ScreenTimeProvider';

function formatHms(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s}s`;
}

export default function ScreenTimeTopBar() {
  const { settings, remainingSeconds, state } = useScreenTime();

  const limitSec = Math.max(1, Math.floor(settings.dailyLimitMinutes * 60));
  const used = Math.min(limitSec, state.usedSeconds);
  const pct = Math.min(100, Math.max(0, (used / limitSec) * 100));

  return (
    <div className='rounded-2xl bg-white/70 backdrop-blur border p-3 sm:p-4 shadow-sm'>
      <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
        <div className='flex-1'>
          <div className='flex items-baseline justify-between'>
            <div className='font-semibold text-sm sm:text-base'>
              ⏳ Thời gian hôm nay
            </div>
            <div className='text-xs sm:text-sm text-muted-foreground'>
              Còn lại:{' '}
              <span className='font-semibold'>
                {formatHms(remainingSeconds)}
              </span>
            </div>
          </div>

          <div className='mt-2 h-2 rounded-full bg-black/10 overflow-hidden'>
            <div
              className='h-full rounded-full bg-emerald-500 transition-all'
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className='mt-1 text-[11px] sm:text-xs text-muted-foreground'>
            Giới hạn: {settings.dailyLimitMinutes} phút/ngày • Cảnh báo khi còn
            ≤ {settings.warningMinutes} phút
          </div>
        </div>
      </div>
    </div>
  );
}
