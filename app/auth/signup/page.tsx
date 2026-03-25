'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { storage } from '@/lib/storage';
import { useAuthStore } from '@/store/authStore';
import { AuthUser } from '@/types';
import Button from '@/components/common/Button';

const POSITIONS = ['Frontend', 'Backend', 'Designer', 'PM', 'ML Engineer', 'DevOps'];

export default function SignupPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [positions, setPositions] = useState<string[]>([]);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const togglePosition = (pos: string) =>
    setPositions((prev) => prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]);

  const handleStep1 = () => {
    setError('');
    if (!email.trim()) { setError('이메일을 입력해 주세요.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('올바른 이메일 형식이 아닙니다.'); return; }
    if (storage.findUserByEmail(email.trim().toLowerCase())) { setError('이미 사용 중인 이메일입니다.'); return; }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return; }
    if (password !== confirmPw) { setError('비밀번호가 일치하지 않습니다.'); return; }
    setStep(2);
  };

  const handleSignup = () => {
    setError('');
    if (!nickname.trim()) { setError('닉네임을 입력해 주세요.'); return; }

    const user: AuthUser = {
      id: `user-${Date.now()}`,
      email: email.trim().toLowerCase(),
      password,
      nickname: nickname.trim(),
      bio: bio.trim(),
      positions,
      techStack: positions,
      totalPoints: 0,
      createdAt: new Date().toISOString(),
    };
    storage.registerUser(user);
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
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-violet-600 font-bold text-xl mb-2">
            <Zap className="h-5 w-5" /> Sync-Up
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
          <p className="text-sm text-gray-500 mt-1">
            {step === 1 ? '계정 정보를 입력하세요' : '프로필을 설정하세요'}
          </p>
          {/* 스텝 인디케이터 */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step ? 'w-6 bg-violet-600' : s < step ? 'w-2 bg-violet-400' : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          {step === 1 ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
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
                    placeholder="6자 이상"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStep1()}
                  placeholder="비밀번호 재입력"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
              {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
              <Button onClick={handleStep1} className="w-full" size="lg">다음</Button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">닉네임 *</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="사용할 닉네임"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">한 줄 소개</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="자신을 한 줄로 소개해 주세요"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">포지션</label>
                <div className="flex flex-wrap gap-2">
                  {POSITIONS.map((pos) => (
                    <button
                      key={pos}
                      onClick={() => togglePosition(pos)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        positions.includes(pos)
                          ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-400'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">이전</Button>
                <Button onClick={handleSignup} className="flex-1" size="lg">가입하기</Button>
              </div>
            </>
          )}

          <div className="text-center text-sm text-gray-500">
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/login" className="text-violet-600 font-medium hover:underline">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
