import { getDateKey } from './dateKey';
import { safeJsonParse } from './storage';

export type ScreenTimeSettings = {
  dailyLimitMinutes: number; // ví dụ 60
  warningMinutes: number; // ví dụ 10 (cảnh báo khi còn <= 10p)
  parentPin?: string; // PIN phụ huynh (tuỳ chọn)
  unlockBonusMinutes?: number; // mở thêm tạm (ví dụ 10p)
};

export type ScreenTimeState = {
  dateKey: string; // YYYY-MM-DD
  usedSeconds: number; // dùng trong ngày
  lastTickMs: number | null;
  locked: boolean; // hết giờ
  warned: boolean; // đã cảnh báo trong ngày
};

function settingsKey(userId: string) {
  return `screenTime:settings:${userId}`;
}
function stateKey(userId: string) {
  return `screenTime:state:${userId}`;
}

export function loadScreenTimeSettings(userId: string): ScreenTimeSettings {
  return safeJsonParse<ScreenTimeSettings>(
    localStorage.getItem(settingsKey(userId)),
    {
      dailyLimitMinutes: 60,
      warningMinutes: 10,
      parentPin: '',
      unlockBonusMinutes: 10,
    }
  );
}

export function saveScreenTimeSettings(userId: string, s: ScreenTimeSettings) {
  localStorage.setItem(settingsKey(userId), JSON.stringify(s));
}

export function loadScreenTimeState(userId: string): ScreenTimeState {
  const today = getDateKey();
  const st = safeJsonParse<ScreenTimeState>(
    localStorage.getItem(stateKey(userId)),
    {
      dateKey: today,
      usedSeconds: 0,
      lastTickMs: null,
      locked: false,
      warned: false,
    }
  );

  // reset khi sang ngày mới
  if (st.dateKey !== today) {
    const reset: ScreenTimeState = {
      dateKey: today,
      usedSeconds: 0,
      lastTickMs: null,
      locked: false,
      warned: false,
    };
    localStorage.setItem(stateKey(userId), JSON.stringify(reset));
    return reset;
  }

  return st;
}

export function saveScreenTimeState(userId: string, st: ScreenTimeState) {
  localStorage.setItem(stateKey(userId), JSON.stringify(st));
}

export function calcRemainingSeconds(
  settings: ScreenTimeSettings,
  st: ScreenTimeState
) {
  const limitSec = Math.max(0, Math.floor(settings.dailyLimitMinutes * 60));
  return Math.max(0, limitSec - st.usedSeconds);
}

export function shouldWarn(
  settings: ScreenTimeSettings,
  remainingSeconds: number
) {
  const warnSec = Math.max(0, Math.floor(settings.warningMinutes * 60));
  return remainingSeconds > 0 && remainingSeconds <= warnSec;
}
