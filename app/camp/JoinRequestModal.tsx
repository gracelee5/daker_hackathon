'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Team, TeamJoinRequest } from '@/types';
import Button from '@/components/common/Button';

interface Props {
  team: Team;
  onClose: () => void;
}

export default function JoinRequestModal({ team, onClose }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);

  const user = storage.getCurrentUser();

  const isMember = user
    ? storage.getTeamMembers(team.teamCode).some((m) => m.userId === user.id)
    : false;
  const hasPending = user
    ? storage.getJoinRequests().some(
        (r) => r.teamCode === team.teamCode && r.fromUserId === user.id && r.status === 'pending'
      )
    : false;

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">로그인 필요</h2>
            <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">팀 합류 신청은 로그인 후 이용할 수 있습니다.</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>취소</Button>
            <Button onClick={() => router.push('/auth/login')}>로그인하기</Button>
          </div>
        </div>
      </div>
    );
  }

  if (isMember || hasPending) {
    const msg = isMember ? '이미 이 팀에 합류되어 있습니다.' : '이미 합류 신청이 대기 중입니다.';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">{isMember ? '이미 합류된 팀' : '신청 대기 중'}</h2>
            <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">{msg}</p>
          <div className="flex justify-end">
            <Button onClick={onClose}>확인</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleRequest = () => {
    const req: TeamJoinRequest = {
      id: `req-${Date.now()}`,
      teamCode: team.teamCode,
      hackathonSlug: team.hackathonSlug,
      fromUserId: user.id,
      fromUserNickname: user.nickname,
      fromUserBio: user.bio ?? '',
      fromUserPositions: user.positions ?? [],
      status: 'pending',
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };
    storage.saveJoinRequest(req);

    // 팀장에게 알림
    if (team.leaderId) {
      storage.addNotification({
        userId: team.leaderId,
        type: 'join_request',
        title: '새 합류 신청',
        message: `${user.nickname}님이 [${team.name}] 팀에 합류 신청했습니다.`,
        data: {
          teamCode: team.teamCode,
          teamName: team.name,
          requestId: req.id,
          hackathonSlug: team.hackathonSlug,
        },
      });
    }
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
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-semibold">{team.name}</span> 팀에 합류 요청을 보냅니다.
            </p>

            {/* 신청자 정보 미리보기 */}
            <div className="rounded-lg bg-violet-50 p-3 mb-4 text-sm">
              <p className="font-medium text-violet-800 mb-1">팀장에게 보여지는 내 정보</p>
              <p className="text-gray-700">닉네임: <span className="font-medium">{user.nickname}</span></p>
              {user.bio && <p className="text-gray-700">소개: {user.bio}</p>}
              {user.positions?.length > 0 && (
                <p className="text-gray-700">포지션: {user.positions.join(', ')}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">추가 메시지 (선택)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="팀에 어떻게 기여할 수 있는지 알려주세요"
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
