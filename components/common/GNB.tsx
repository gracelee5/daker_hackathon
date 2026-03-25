'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Users, Trophy, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/hackathons', label: '해커톤', icon: Zap },
  { href: '/camp', label: '팀 모집', icon: Users },
  { href: '/rankings', label: '랭킹', icon: Trophy },
];

export default function GNB() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 font-bold text-violet-600 text-lg">
          <Zap className="h-5 w-5" />
          Sync-Up
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* 프로필 링크 */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/profile/me"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <User className="h-4 w-4" />
            프로필
          </Link>
        </div>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="메뉴"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
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
                  active
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
          <Link
            href="/profile/me"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <User className="h-4 w-4" />
            프로필
          </Link>
        </div>
      )}
    </header>
  );
}
