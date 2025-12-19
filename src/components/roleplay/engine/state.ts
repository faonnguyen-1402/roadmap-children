// src/components/roleplay/engine/state.ts
export type Stats = {
  calm: number;
  empathy: number;
  logic: number;
  teamwork: number;
};

export type Delta = Partial<Stats> | undefined;

export const defaultStats: Stats = {
  calm: 0,
  empathy: 0,
  logic: 0,
  teamwork: 0,
};

function clamp(n: number, min = 0, max = 99) {
  return Math.max(min, Math.min(max, n));
}

export function applyDelta(prev: Stats, delta: Delta): Stats {
  if (!delta) return prev;
  return {
    calm: clamp(prev.calm + (delta.calm ?? 0)),
    empathy: clamp(prev.empathy + (delta.empathy ?? 0)),
    logic: clamp(prev.logic + (delta.logic ?? 0)),
    teamwork: clamp(prev.teamwork + (delta.teamwork ?? 0)),
  };
}
