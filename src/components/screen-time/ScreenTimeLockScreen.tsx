'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useScreenTime } from './ScreenTimeProvider';

export default function ScreenTimeLockScreen() {
  const { isLocked, unlockWithPin, settings } = useScreenTime();
  const [pin, setPin] = useState('');
  const [msg, setMsg] = useState<string>('');

  if (!isLocked) return null;

  return (
    <div className='fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100'>
      <div className='w-full max-w-md rounded-2xl bg-white shadow-xl p-5'>
        <div className='text-2xl font-bold'>⛔ Hết giờ hôm nay</div>
        <p className='mt-2 text-sm text-muted-foreground'>
          Con đã dùng hết giới hạn thời gian trong ngày. Hãy nghỉ ngơi nhé! 👋
        </p>

        <div className='mt-4 rounded-xl bg-muted/30 p-3'>
          <div className='font-semibold text-sm'>
            Mở thêm thời gian (Phụ huynh)
          </div>
          <div className='mt-2 flex gap-2'>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder='Nhập PIN'
              className='flex-1 border rounded-lg px-3 py-2 text-sm'
              type='password'
            />
            <Button
              onClick={() => {
                const r = unlockWithPin(pin);
                setMsg(r.message);
                if (r.ok) setPin('');
              }}
            >
              Mở
            </Button>
          </div>
          <div className='mt-2 text-xs text-muted-foreground'>
            Bonus: {Math.max(1, Math.floor(settings.unlockBonusMinutes ?? 10))}{' '}
            phút
          </div>
          {msg && <div className='mt-2 text-xs font-medium'>{msg}</div>}
        </div>
      </div>
    </div>
  );
}
