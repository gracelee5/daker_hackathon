'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Zap, Users, Trophy, User, Menu, X, Bell, LogOut, LogIn } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { storage } from '@/lib/storage';
import { getPublicTeams } from '@/lib/data';
import { Notification, Team } from '@/types';
import TeamManageModal from './TeamManageModal';

const NAV_ITEMS = [
  { href: '/hackathons', label: '해커톤', icon: Zap },
  { href: '/camp', label: '팀 모집', icon: Users },
  { href: '/rankings', label: '랭킹', icon: Trophy },
];

export default function GNB() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, notifications, unreadCount, logout, markNotificationRead, markAllNotificationsRead, refreshNotifications } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [managingTeam, setManagingTeam] = useState<Team | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // 드롭다운 열릴 때 알림 갱신
  useEffect(() => {
    if (notifOpen) refreshNotifications();
  }, [notifOpen, refreshNotifications]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleNotifClick = (n: Notification) => {
    markNotificationRead(n.id);
    setNotifOpen(false);
    // 알림 타입별 이동
    if (n.type === 'join_request' && n.data?.teamCode) {
      const allTeams = [...storage.getTeams(), ...getPublicTeams()];
      const found = allTeams.find((t) => t.teamCode === n.data!.teamCode);
      if (found) { setManagingTeam(found); return; }
      router.push(`/camp?manage=${n.data.teamCode}`);
    } else if (n.type === 'request_accepted' && n.data?.teamCode) {
      router.push(`/teams/${n.data.teamCode}`);
    } else if (n.type === 'hackathon_registered' && n.data?.hackathonSlug) {
      router.push(`/hackathons/${n.data.hackathonSlug}`);
    } else if (n.type === 'submission_complete' && n.data?.hackathonSlug) {
      router.push(`/profile/me`);
    } else if (n.type === 'team_chat' && n.data?.teamCode) {
      router.push(`/teams/${n.data.teamCode}#chat`);
    }
  };

  return (
  <>
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-violet-600 text-lg">
          <Zap className="h-5 w-5" />
          Sync-Up
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active ? 'bg-violet-50 text-violet-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-1">
          {ready && user ? (
            <>
              {/* 알림 */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="알림"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm">알림</p>
                      {unreadCount > 0 && (
                        <button onClick={markAllNotificationsRead} className="text-xs text-violet-600 hover:underline">
                          모두 읽음
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">알림이 없습니다.</p>
                      ) : (
                        notifications.slice(0, 20).map((n) => (
                          <button
                            key={n.id}
                            onClick={() => handleNotifClick(n)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                              !n.read ? 'bg-violet-50/50' : ''
                            }`}
                          >
                            <p className={`text-sm font-medium ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                              {n.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(n.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                    <div className="border-t border-gray-100 px-4 py-2">
                      <Link href="/notifications" className="block text-center text-xs text-violet-600 hover:underline py-1" onClick={() => setNotifOpen(false)}>
                        전체 알림 보기
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/profile/me"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <User className="h-4 w-4" />
                {user.nickname}
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="로그아웃"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : ready ? (
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              로그인
            </Link>
          ) : null}
        </div>

        <button
          className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="메뉴"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? 'bg-violet-50 text-violet-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
          {user ? (
            <>
              <Link href="/profile/me" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <User className="h-4 w-4" /> {user.nickname}
              </Link>
              <Link href="/notifications" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Bell className="h-4 w-4" /> 알림
                {unreadCount > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">{unreadCount}</span>
                )}
              </Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" /> 로그아웃
              </button>
            </>
          ) : (
            <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-violet-700 hover:bg-violet-50">
              <LogIn className="h-4 w-4" /> 로그인
            </Link>
          )}
        </div>
      )}

    </header>
    {managingTeam && (
      <TeamManageModal team={managingTeam} onClose={() => setManagingTeam(null)} />
    )}
  </>
  );
}
