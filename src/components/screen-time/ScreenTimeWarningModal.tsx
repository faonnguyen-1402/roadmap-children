'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export default function ScreenTimeWarningModal({
  open,
  remainingSeconds,
  onClose,
}: {
  open: boolean;
  remainingSeconds: number;
  onClose: () => void;
}) {
  if (!open) return null;

  const m = Math.floor(remainingSeconds / 60);
  const s = remainingSeconds % 60;

  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />
      <div className='relative w-full max-w-md rounded-2xl bg-white shadow-xl p-5'>
        <div className='text-xl font-bold'>⚠️ Sắp hết giờ rồi!</div>
        <p className='mt-2 text-sm text-muted-foreground'>
          Con còn khoảng{' '}
          <span className='font-semibold'>
            {m} phút {s}s
          </span>
          . Hãy hoàn thành phần đang làm và nghỉ ngơi nhé.
        </p>
        <div className='mt-4 flex justify-end gap-2'>
          <Button variant='outline' onClick={onClose}>
            Con hiểu rồi
          </Button>
        </div>
      </div>
    </div>
  );
}
