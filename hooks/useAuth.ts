'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { UserProfile, AuthUser } from '@/types';

// 앱 최초 실행 시 테스트 계정 자동 생성
function ensureTestAccount() {
  if (typeof window === 'undefined') return;
  const existing = storage.findUserByEmail('test@syncup.com');
  if (!existing) {
    const testUser: AuthUser = {
      id: 'user-test-001',
      email: 'test@syncup.com',
      password: 'password1234',
      nickname: '테스터',
      bio: '심사용 테스트 계정입니다.',
      positions: ['Frontend', 'PM'],
      techStack: ['Frontend', 'PM'],
      totalPoints: 1200,
      createdAt: '2026-01-01T00:00:00+09:00',
    };
    storage.registerUser(testUser);
  }
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureTestAccount();
    setUser(storage.getCurrentUser());
    setReady(true);
  }, []);

  const logout = () => {
    storage.logout();
    setUser(null);
  };

  const refresh = () => {
    setUser(storage.getCurrentUser());
  };

  return { user, ready, logout, refresh };
}
