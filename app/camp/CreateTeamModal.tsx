'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Hackathon, Team } from '@/types';
import Button from '@/components/common/Button';

const POSITIONS = ['Frontend', 'Backend', 'Designer', 'PM', 'ML Engineer', 'DevOps'];

interface Props {
  hackathons: Hackathon[];
  onClose: () => void;
}

export default function CreateTeamModal({ hackathons, onClose }: Props) {
  const [name, setName] = useState('');
  const [hackathonSlug, setHackathonSlug] = useState(hackathons[0]?.slug ?? '');
  const [intro, setIntro] = useState('');
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [contactUrl, setContactUrl] = useState('');

  const togglePosition = (pos: string) => {
    setLookingFor((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
    );
  };

  const handleCreate = () => {
    if (!name.trim() || !hackathonSlug) return;

    const team: Team = {
      teamCode: `T-${Date.now()}`,
      hackathonSlug,
      name: name.trim(),
      isOpen: true,
      memberCount: 1,
      lookingFor,
      intro: intro.trim(),
      contact: { type: 'link', url: contactUrl.trim() },
      createdAt: new Date().toISOString(),
    };
    storage.saveTeam(team);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">팀 만들기</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">해커톤</label>
            <select
              value={hackathonSlug}
              onChange={(e) => setHackathonSlug(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
            >
              {hackathons.map((h) => (
                <option key={h.slug} value={h.slug}>{h.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">팀 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="팀 이름 입력"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">팀 소개</label>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="팀 목표·방향 소개"
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">모집 포지션</label>
            <div className="flex flex-wrap gap-2">
              {POSITIONS.map((pos) => (
                <button
                  key={pos}
                  onClick={() => togglePosition(pos)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    lookingFor.includes(pos)
                      ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-400'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연락처 링크</label>
            <input
              type="url"
              value={contactUrl}
              onChange={(e) => setContactUrl(e.target.value)}
              placeholder="https://open.kakao.com/..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={onClose}>취소</Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>팀 생성</Button>
        </div>
      </div>
    </div>
  );
}
