'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Users } from 'lucide-react';
import { storage } from '@/lib/storage';
import { useAuthStore } from '@/store/authStore';
import { Team, TeamJoinRequest } from '@/types';
import Badge from './Badge';
import Button from './Button';

interface Props {
  team: Team;
  onClose: () => void;
  onTeamUpdated?: (team: Team) => void;
}

export default function TeamManageModal({ team, onClose, onTeamUpdated }: Props) {
  const { addNotification } = useAuthStore();
  const [requests, setRequests] = useState<TeamJoinRequest[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team>(team);

  useEffect(() => {
    setRequests(storage.getJoinRequestsForTeam(team.teamCode));
  }, [team.teamCode]);

  const handleDecision = (req: TeamJoinRequest, status: 'accepted' | 'rejected') => {
    storage.updateJoinRequestStatus(req.id, status);

    addNotification({
      userId: req.fromUserId,
      type: status === 'accepted' ? 'request_accepted' : 'request_rejected',
      title: status === 'accepted' ? '팀 합류 승인' : '팀 합류 거절',
      message:
        status === 'accepted'
          ? `[${team.name}] 팀 합류 신청이 승인되었습니다! 🎉`
          : `[${team.name}] 팀 합류 신청이 거절되었습니다.`,
      data: { teamCode: team.teamCode, teamName: team.name, hackathonSlug: team.hackathonSlug },
    });

    setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status } : r)));

    if (status === 'accepted') {
      const updated = storage.getTeams().find((t) => t.teamCode === team.teamCode);
      if (updated) {
        setCurrentTeam(updated);
        onTeamUpdated?.(updated);
      }
    }
  };

  const handleClose = () => {
    storage.closeTeam(currentTeam.teamCode);
    const updated = storage.getTeams().find((t) => t.teamCode === currentTeam.teamCode);
    if (updated) {
      setCurrentTeam(updated);
      onTeamUpdated?.(updated);
    }
  };

  const pending = requests.filter((r) => r.status === 'pending');
  const decided = requests.filter((r) => r.status !== 'pending');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{currentTeam.name} 관리</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {currentTeam.memberCount} / {currentTeam.maxMembers}명
              {!currentTeam.isOpen && <span className="ml-2 text-red-500 font-medium">• 모집 마감</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {currentTeam.isOpen && (
              <Button variant="danger" size="sm" onClick={handleClose}>모집 마감</Button>
            )}
            <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-violet-500" />
              대기 중 ({pending.length})
            </h3>
            {pending.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">대기 중인 신청이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {pending.map((req) => (
                  <div key={req.id} className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{req.fromUserNickname}</p>
                        {req.fromUserBio && <p className="text-xs text-gray-500 mt-0.5">{req.fromUserBio}</p>}
                      </div>
                      <div className="flex gap-1">
                        {req.fromUserPositions?.map((pos) => (
                          <Badge key={pos} className="text-xs">{pos}</Badge>
                        ))}
                      </div>
                    </div>
                    {req.message && (
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 mb-3">"{req.message}"</p>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleDecision(req, 'accepted')} disabled={!currentTeam.isOpen} className="flex-1">
                        <CheckCircle className="h-3.5 w-3.5" /> 수락
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDecision(req, 'rejected')} className="flex-1">
                        <XCircle className="h-3.5 w-3.5" /> 거절
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {decided.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">처리 완료 ({decided.length})</h3>
              <div className="space-y-2">
                {decided.map((req) => (
                  <div key={req.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">
                    <span className="text-sm text-gray-700">{req.fromUserNickname}</span>
                    <span className={`text-xs font-medium ${req.status === 'accepted' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {req.status === 'accepted' ? '수락됨' : '거절됨'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
