'use client';

import { useEffect, useRef } from 'react';

type RafOptions = {
  enabled?: boolean;
  maxDt?: number;
  timeScale?: number; // 🔥 slow / fast motion
  pauseOnHidden?: boolean; // 🔥 auto pause khi tab ẩn
  onTickStart?: (dt: number) => void;
  onTickEnd?: (dt: number) => void;
};

/**
 * useRafLoop
 * - cb(dt): game loop callback (seconds)
 * - options:
 *    - enabled: bật/tắt loop
 *    - maxDt: clamp dt (chống lag spike)
 *    - timeScale: tốc độ thời gian (1 = bình thường)
 *    - pauseOnHidden: auto pause khi tab ẩn
 */
export function useRafLoop(
  cb: (dt: number) => void,
  {
    enabled = true,
    maxDt = 0.05,
    timeScale = 1,
    pauseOnHidden = true,
    onTickStart,
    onTickEnd,
  }: RafOptions = {}
) {
  const rafId = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);
  const cbRef = useRef(cb);
  const enabledRef = useRef(enabled);
  const timeScaleRef = useRef(timeScale);

  cbRef.current = cb;
  enabledRef.current = enabled;
  timeScaleRef.current = timeScale;

  useEffect(() => {
    let cancelled = false;

    // ❌ cleanup loop cũ (quan trọng với React StrictMode)
    if (rafId.current != null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    lastTime.current = null;

    if (!enabled) return;

    const loop = (time: number) => {
      if (cancelled || !enabledRef.current) return;

      if (lastTime.current == null) lastTime.current = time;

      let dt = (time - lastTime.current) / 1000;
      lastTime.current = time;

      // clamp dt
      if (dt > maxDt) dt = maxDt;
      if (dt < 0) dt = 0;

      // apply time scale
      dt *= timeScaleRef.current;

      onTickStart?.(dt);
      cbRef.current(dt);
      onTickEnd?.(dt);

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      if (rafId.current != null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      lastTime.current = null;
    };
  }, [enabled, maxDt, pauseOnHidden, onTickStart, onTickEnd]);

  // 🔥 Auto pause khi tab ẩn (rất quan trọng cho game)
  useEffect(() => {
    if (!pauseOnHidden) return;

    const onVisibility = () => {
      if (document.hidden) {
        lastTime.current = null; // reset dt
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [pauseOnHidden]);
}
