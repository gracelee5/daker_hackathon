'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { UserProfile } from '@/types';
import Button from '@/components/common/Button';

const POSITIONS = ['Frontend', 'Backend', 'Designer', 'PM', 'ML Engineer', 'DevOps'];

interface Props {
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
}

export default function ProfileSetupModal({ onSave, onClose }: Props) {
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [positions, setPositions] = useState<string[]>([]);

  const togglePosition = (pos: string) => {
    setPositions((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
    );
  };

  const handleSave = () => {
    if (!nickname.trim()) return;
    const profile: UserProfile = {
      id: `user-${Date.now()}`,
      nickname: nickname.trim(),
      bio: bio.trim(),
      positions,
      techStack: positions,
      totalPoints: 0,
      createdAt: new Date().toISOString(),
    };
    onSave(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">프로필 설정</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="사용할 닉네임"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">한 줄 소개</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자신을 한 줄로 소개해 주세요"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
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
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={onClose}>취소</Button>
          <Button onClick={handleSave} disabled={!nickname.trim()}>저장</Button>
        </div>
      </div>
    </div>
  );
}
