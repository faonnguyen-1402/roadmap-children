const key = (userId: string) => `favorites:${userId}`;

export function loadFavorites(userId: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(key(userId)) || '[]');
  } catch {
    return [];
  }
}

export function saveFavorites(userId: string, ids: string[]) {
  localStorage.setItem(key(userId), JSON.stringify(ids));
}

export function toggleFavorite(userId: string, id: string): string[] {
  const cur = loadFavorites(userId);
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  saveFavorites(userId, next);
  return next;
}
