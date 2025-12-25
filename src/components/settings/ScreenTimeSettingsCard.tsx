'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useScreenTime } from '@/components/screen-time/ScreenTimeProvider';

export default function ScreenTimeSettingsCard() {
  const { settings, setSettings } = useScreenTime();

  const [dailyLimit, setDailyLimit] = useState(settings.dailyLimitMinutes);
  const [warningMin, setWarningMin] = useState(settings.warningMinutes);
  const [pin, setPin] = useState(settings.parentPin || '');
  const [bonus, setBonus] = useState(settings.unlockBonusMinutes ?? 10);

  useEffect(() => {
    setDailyLimit(settings.dailyLimitMinutes);
    setWarningMin(settings.warningMinutes);
    setPin(settings.parentPin || '');
    setBonus(settings.unlockBonusMinutes ?? 10);
  }, [settings]);

  return (
    <Card className='bg-gradient-to-br from-white/70 to-white/40 backdrop-blur border'>
      <CardHeader>
        <CardTitle className='text-lg sm:text-xl'>
          ⚙️ Cài đặt giới hạn thời gian
        </CardTitle>
        <CardDescription>
          Thiết lập giới hạn theo ngày cho từng bé (từng tài khoản).
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <label className='space-y-1'>
            <div className='text-sm font-medium'>Giới hạn mỗi ngày (phút)</div>
            <input
              className='w-full border rounded-lg px-3 py-2 text-sm'
              type='number'
              min={1}
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
            />
          </label>

          <label className='space-y-1'>
            <div className='text-sm font-medium'>Cảnh báo khi còn (phút)</div>
            <input
              className='w-full border rounded-lg px-3 py-2 text-sm'
              type='number'
              min={1}
              value={warningMin}
              onChange={(e) => setWarningMin(Number(e.target.value))}
            />
          </label>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <label className='space-y-1'>
            <div className='text-sm font-medium'>PIN phụ huynh (tuỳ chọn)</div>
            <input
              className='w-full border rounded-lg px-3 py-2 text-sm'
              type='password'
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder='Ví dụ: 1234'
            />
          </label>

          <label className='space-y-1'>
            <div className='text-sm font-medium'>Mở thêm (phút)</div>
            <input
              className='w-full border rounded-lg px-3 py-2 text-sm'
              type='number'
              min={1}
              value={bonus}
              onChange={(e) => setBonus(Number(e.target.value))}
            />
          </label>
        </div>

        <Button
          onClick={() => {
            setSettings({
              dailyLimitMinutes: Math.max(1, Math.floor(dailyLimit)),
              warningMinutes: Math.max(1, Math.floor(warningMin)),
              parentPin: pin,
              unlockBonusMinutes: Math.max(1, Math.floor(bonus)),
            });
          }}
          className='w-full'
        >
          Lưu cài đặt
        </Button>
      </CardContent>
    </Card>
  );
}
