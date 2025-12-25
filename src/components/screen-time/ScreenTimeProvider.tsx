'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  calcRemainingSeconds,
  loadScreenTimeSettings,
  loadScreenTimeState,
  saveScreenTimeSettings,
  saveScreenTimeState,
  shouldWarn,
  type ScreenTimeSettings,
  type ScreenTimeState,
} from '@/lib/screenTime';

type Ctx = {
  settings: ScreenTimeSettings;
  setSettings: (next: ScreenTimeSettings) => void;

  state: ScreenTimeState;
  remainingSeconds: number;

  isLocked: boolean;
  unlockWithPin: (pin: string) => { ok: boolean; message: string };
};

const ScreenTimeContext = createContext<Ctx | null>(null);

export function useScreenTime() {
  const ctx = useContext(ScreenTimeContext);
  if (!ctx) throw new Error('useScreenTime must be used inside ScreenTimeProvider');
  return ctx;
}

function formatMmSs(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function ScreenTimeProvider({
  userId,
  children,
  onWarn,
  onLocked,
}: {
  userId: string;
  children: React.ReactNode;
  onWarn?: (remainingSeconds: number) => void;
  onLocked?: () => void;
}) {
  const [settings, _setSettings] = useState<ScreenTimeSettings>(() => loadScreenTimeSettings(userId));
  const [state, setState] = useState<ScreenTimeState>(() => loadScreenTimeState(userId));
  const tickRef = useRef<number | null>(null);

  // keep settings synced if user changes
  useEffect(() => {
    _setSettings(loadScreenTimeSettings(userId));
    setState(loadScreenTimeState(userId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const remainingSeconds = useMemo(() => calcRemainingSeconds(settings, state), [settings, state]);
  const isLocked = state.locked || remainingSeconds <= 0;

  const setSettings = (next: ScreenTimeSettings) => {
    _setSettings(next);
    saveScreenTimeSettings(userId, next);
  };

  // main ticking
  useEffect(() => {
    // reset day if needed
    const fresh = loadScreenTimeState(userId);
    setState(fresh);

    const start = () => {
      if (tickRef.current != null) return;
      tickRef.current = window.setInterval(() => {
        setState((prev) => {
          const latest = loadScreenTimeState(userId);
          // nếu đã locked thì không tăng nữa
          if (latest.locked) return latest;

          const now = Date.now();
          const last = latest.lastTickMs ?? now;
          const deltaSec = Math.max(0, Math.floor((now - last) / 1000));

          const updated: ScreenTimeState = {
            ...latest,
            lastTickMs: now,
            usedSeconds: latest.usedSeconds + deltaSec,
          };

          const remain = calcRemainingSeconds(settings, updated);

          // warning
          if (!updated.warned && shouldWarn(settings, remain)) {
            updated.warned = true;
            onWarn?.(remain);
          }

          // lock
          if (remain <= 0) {
            updated.locked = true;
            onLocked?.();
          }

          saveScreenTimeState(userId, updated);
          return updated;
        });
      }, 1000);
    };

    const stop = () => {
      if (tickRef.current != null) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
      setState((prev) => {
        const latest = loadScreenTimeState(userId);
        const now = Date.now();
        const updated: ScreenTimeState = { ...latest, lastTickMs: now };
        saveScreenTimeState(userId, updated);
        return updated;
      });
    };

    start();

    const onVis = () => {
      if (document.visibilityState === 'hidden') stop();
      else start();
    };

    window.addEventListener('visibilitychange', onVis);
    window.addEventListener('beforeunload', stop);

    return () => {
      stop();
      window.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('beforeunload', stop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, settings.dailyLimitMinutes, settings.warningMinutes]);

  const unlockWithPin = (pin: string) => {
    const s = loadScreenTimeSettings(userId);
    const st = loadScreenTimeState(userId);

    const correct = (s.parentPin || '').trim();
    if (!correct) return { ok: false, message: 'Chưa đặt PIN phụ huynh trong Cài đặt.' };
    if (pin.trim() !== correct) return { ok: false, message: 'PIN không đúng.' };

    // mở tạm: trừ usedSeconds xuống (cho thêm thời gian)
    const bonusMin = Math.max(1, Math.floor(s.unlockBonusMinutes ?? 10));
    const bonusSec = bonusMin * 60;
    const next: ScreenTimeState = {
      ...st,
      locked: false,
      // giảm usedSeconds để còn time
      usedSeconds: Math.max(0, st.usedSeconds - bonusSec),
      warned: false, // cho phép cảnh báo lại nếu cần
      lastTickMs: Date.now(),
    };
    saveScreenTimeState(userId, next);
    setState(next);
    return { ok: true, message: `Đã mở thêm ${bonusMin} phút.` };
  };

  const value: Ctx = {
    settings,
    setSettings,
    state,
    remainingSeconds,
    isLocked,
    unlockWithPin,
  };

  return <ScreenTimeContext.Provider value={value}>{children}</ScreenTimeContext.Provider>;
}

// export helper nếu bạn muốn dùng nhanh
export const screenTimeFormat = { formatMmSs };
