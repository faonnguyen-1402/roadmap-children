export const TILE = 32;

/**
 * Legend:
 * 1 = wall
 * 0 = floor
 * A/B/C/D = floor theo zone (để tô màu khác nhau)
 */
export const MAP = [
  '111111111111111111111111',
  '1A0000000000000000000001',
  '1A0111111111111111111101',
  '1A0100000000000000000101',
  '1A0101111111111111100101',
  '1B0101000000000000100101',
  '1B0101011111111110100101',
  '1B0101010000000010100101',
  '1B0101010111111010100101',
  '1C0101010100001010100101',
  '1C0101010101111010100101',
  '1C0100000100000010100001',
  '1C0111110111111110111101',
  '1D0000000000000000000001',
  '111111111111111111111111',
];

export const MAP_W = MAP[0].length * TILE;
export const MAP_H = MAP.length * TILE;

export function isWall(tx: number, ty: number) {
  if (ty < 0 || ty >= MAP.length) return true;
  if (tx < 0 || tx >= MAP[0].length) return true;
  return MAP[ty][tx] === '1';
}

export function floorTypeAt(tx: number, ty: number) {
  if (ty < 0 || ty >= MAP.length) return '0';
  if (tx < 0 || tx >= MAP[0].length) return '0';
  const c = MAP[ty][tx];
  if (c === '1') return '1';
  return c; // 0/A/B/C/D
}

export function findFirstOpenTile() {
  for (let y = 0; y < MAP.length; y++) {
    for (let x = 0; x < MAP[0].length; x++) {
      if (MAP[y][x] !== '1') return { x, y };
    }
  }
  return { x: 1, y: 1 };
}
