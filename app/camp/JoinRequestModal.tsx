'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Team, TeamJoinRequest } from '@/types';
import Button from '@/components/common/Button';

interface Props {
  team: Team;
  onClose: () => void;
}

export default function JoinRequestModal({ team, onClose }: Props) {
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);

  const handleRequest = () => {
    const user = storage.getCurrentUser();
    const req: TeamJoinRequest = {
      id: `req-${Date.now()}`,
      teamCode: team.teamCode,
      hackathonSlug: team.hackathonSlug,
      fromUserId: user?.id ?? 'guest',
      status: 'pending',
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };
    storage.saveJoinRequest(req);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">합류 요청</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {done ? (
          <div className="text-center py-6">
            <p className="font-semibold text-gray-900 mb-1">요청이 전송되었습니다!</p>
            <p className="text-sm text-gray-500 mb-4">팀 리더의 수락을 기다려 주세요.</p>
            <Button onClick={onClose}>확인</Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">{team.name}</span> 팀에 합류 요청을 보냅니다.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">한 줄 소개 (선택)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="간단한 자기소개를 남겨보세요"
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={onClose}>취소</Button>
              <Button onClick={handleRequest}>요청 보내기</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
