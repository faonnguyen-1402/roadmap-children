'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadNotifications, markAllRead, markOneRead, type AppNotification } from '@/lib/notifications';

export default function NotificationsBell({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<AppNotification[]>(() => loadNotifications(userId));

  const unread = useMemo(() => list.filter((x) => !x.read).length, [list]);

  const refresh = () => setList(loadNotifications(userId));

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="h-9 px-3"
        onClick={() => {
          setOpen((o) => !o);
          refresh();
        }}
      >
        🔔
        {unread > 0 && (
          <Badge className="ml-2" variant="secondary">
            {unread}
          </Badge>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-[340px] z-50">
          <Card className="shadow-xl">
            <CardHeader className="py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Thông báo</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="h-8 text-xs"
                  onClick={() => {
                    setList(markAllRead(userId));
                  }}
                >
                  Đã đọc hết
                </Button>
                <Button variant="outline" className="h-8 text-xs" onClick={() => setOpen(false)}>
                  Đóng
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 max-h-[380px] overflow-auto">
              {list.length === 0 && (
                <div className="text-xs text-muted-foreground">Chưa có thông báo.</div>
              )}

              {list.map((n) => (
                <div
                  key={n.id}
                  className={[
                    'p-3 rounded-xl border text-sm cursor-pointer',
                    n.read ? 'bg-white' : 'bg-amber-50 border-amber-200',
                  ].join(' ')}
                  onClick={() => setList(markOneRead(userId, n.id))}
                >
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.message}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
