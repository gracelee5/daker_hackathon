'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Users, CheckCircle, XCircle } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Notification } from '@/types';
import Card from '@/components/common/Card';
import { EmptyState, LoadingSpinner } from '@/components/common/StatusUI';

const TYPE_ICON: Record<Notification['type'], React.ReactNode> = {
  join_request: <Users className="h-5 w-5 text-violet-500" />,
  request_accepted: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  request_rejected: <XCircle className="h-5 w-5 text-red-400" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (user) {
      setUserId(user.id);
      setNotifications(storage.getNotifications(user.id));
    }
    setLoading(false);
  }, []);

  const handleMarkAllRead = () => {
    if (!userId) return;
    storage.markAllNotificationsRead(userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkRead = (id: string) => {
    storage.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  if (loading) return <LoadingSpinner />;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-violet-500" />
          <h1 className="text-2xl font-bold text-gray-900">알림</h1>
          {unreadCount > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-sm text-violet-600 hover:underline"
          >
            <CheckCheck className="h-4 w-4" />
            모두 읽음
          </button>
        )}
      </div>

      {!userId ? (
        <EmptyState
          title="로그인이 필요합니다"
          description="로그인 후 알림을 확인할 수 있습니다."
        />
      ) : notifications.length === 0 ? (
        <EmptyState
          title="알림이 없습니다"
          description="팀 합류 신청이나 결과 알림이 여기에 표시됩니다."
        />
      ) : (
        <Card padding="none">
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleMarkRead(n.id)}
                className={`w-full text-left flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${
                  !n.read ? 'bg-violet-50/40' : ''
                }`}
              >
                <div className="shrink-0 mt-0.5">{TYPE_ICON[n.type]}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                    {n.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {!n.read && (
                  <div className="shrink-0 mt-1.5 h-2 w-2 rounded-full bg-violet-500" />
                )}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
