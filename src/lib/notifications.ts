export type AppNotification = {
  id: string;
  type: 'course_complete';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

const key = (userId: string) => `notifications:${userId}`;

export function loadNotifications(userId: string): AppNotification[] {
  try {
    return JSON.parse(localStorage.getItem(key(userId)) || '[]');
  } catch {
    return [];
  }
}

export function saveNotifications(userId: string, list: AppNotification[]) {
  localStorage.setItem(key(userId), JSON.stringify(list));
}

export function pushNotification(
  userId: string,
  n: Omit<AppNotification, 'id' | 'read'>
) {
  const list = loadNotifications(userId);
  const next: AppNotification[] = [
    {
      id: Math.random().toString(36).slice(2, 10),
      read: false,
      ...n,
    },
    ...list,
  ];
  saveNotifications(userId, next);
  return next;
}

export function markAllRead(userId: string) {
  const list = loadNotifications(userId).map((x) => ({ ...x, read: true }));
  saveNotifications(userId, list);
  return list;
}

export function markOneRead(userId: string, id: string) {
  const list = loadNotifications(userId).map((x) =>
    x.id === id ? { ...x, read: true } : x
  );
  saveNotifications(userId, list);
  return list;
}
