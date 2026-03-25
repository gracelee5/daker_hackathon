'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { storage } from '@/lib/storage';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/common/Button';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError('');
    if (!email || !password) { setError('이메일과 비밀번호를 입력해 주세요.'); return; }

    setLoading(true);
    const user = storage.findUserByEmail(email.trim().toLowerCase());
    if (!user || user.password !== password) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      setLoading(false);
      return;
    }

    login({
      id: user.id,
      nickname: user.nickname,
      bio: user.bio,
      positions: user.positions,
      techStack: user.techStack,
      totalPoints: user.totalPoints,
      createdAt: user.createdAt,
    });
    router.push('/profile/me');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-violet-600 font-bold text-xl mb-2">
            <Zap className="h-5 w-5" /> Sync-Up
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
          <p className="text-sm text-gray-500 mt-1">해커톤 성장 여정을 이어가세요</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="test@syncup.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button onClick={handleLogin} disabled={loading} className="w-full" size="lg">
            {loading ? '로그인 중...' : '로그인'}
          </Button>

          <div className="text-center text-sm text-gray-500">
            계정이 없으신가요?{' '}
            <Link href="/auth/signup" className="text-violet-600 font-medium hover:underline">
              회원가입
            </Link>
          </div>
        </div>

        {/* 테스트 계정 안내 */}
        <div className="mt-4 rounded-xl bg-violet-50 border border-violet-100 px-4 py-3 text-sm text-violet-700">
          <p className="font-medium mb-1">🔑 심사용 테스트 계정</p>
          <p>이메일: <span className="font-mono font-semibold">test@syncup.com</span></p>
          <p>비밀번호: <span className="font-mono font-semibold">password1234</span></p>
        </div>
      </div>
    </div>
  );
}
