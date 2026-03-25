'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { Users, Plus, Settings } from 'lucide-react';
import { getHackathons, getPublicTeams } from '@/lib/data';
import { storage } from '@/lib/storage';
import { Team } from '@/types';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { EmptyState, LoadingSpinner } from '@/components/common/StatusUI';
import CreateTeamModal from './CreateTeamModal';
import JoinRequestModal from './JoinRequestModal';
import TeamRequestsPanel from './TeamRequestsPanel';

const POSITIONS = ['Frontend', 'Backend', 'Designer', 'PM', 'ML Engineer', 'DevOps'];

function CampContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hackathonFilter = searchParams.get('hackathon') ?? 'all';

  const hackathons = getHackathons();
  const publicTeams = getPublicTeams();

  const [localTeams, setLocalTeams] = useState<Team[]>(() => storage.getTeams());
  const [hackathonSlug, setHackathonSlug] = useState(hackathonFilter);
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [showOpen, setShowOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinTarget, setJoinTarget] = useState<Team | null>(null);
  const [managingTeam, setManagingTeam] = useState<Team | null>(null);

  const currentUser = storage.getCurrentUser();

  // 공개 팀 + 내가 만든 팀 병합
  const allTeams = useMemo(() => {
    const codes = new Set(publicTeams.map((t) => t.teamCode));
    const merged = [...publicTeams, ...localTeams.filter((t) => !codes.has(t.teamCode))];
    // 로컬 팀 변경사항 덮어쓰기
    return merged.map((t) => {
      const local = localTeams.find((l) => l.teamCode === t.teamCode);
      return local ?? t;
    });
  }, [publicTeams, localTeams]);

  const filtered = useMemo(() => {
    return allTeams.filter((t) => {
      if (hackathonSlug !== 'all' && t.hackathonSlug !== hackathonSlug) return false;
      if (positionFilter !== 'all' && !t.lookingFor.includes(positionFilter)) return false;
      if (showOpen && !t.isOpen) return false;
      return true;
    });
  }, [allTeams, hackathonSlug, positionFilter, showOpen]);

  const handleTeamUpdated = (updated: Team) => {
    setLocalTeams((prev) => {
      const idx = prev.findIndex((t) => t.teamCode === updated.teamCode);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return prev;
    });
    if (managingTeam?.teamCode === updated.teamCode) {
      setManagingTeam(updated);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">팀 모집</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> 팀 만들기
        </Button>
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={hackathonSlug}
          onChange={(e) => setHackathonSlug(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
        >
          <option value="all">전체 해커톤</option>
          {hackathons.map((h) => (
            <option key={h.slug} value={h.slug}>{h.title}</option>
          ))}
        </select>

        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
        >
          <option value="all">전체 포지션</option>
          {POSITIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showOpen}
            onChange={(e) => setShowOpen(e.target.checked)}
            className="rounded border-gray-300"
          />
          모집 중만
        </label>
      </div>

      {/* 팀 목록 */}
      {filtered.length === 0 ? (
        <EmptyState
          title="팀이 없습니다"
          description="첫 번째로 팀을 만들어 보세요!"
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" /> 팀 만들기
            </Button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((team) => {
            const hackathon = hackathons.find((h) => h.slug === team.hackathonSlug);
            const isLeader = currentUser && team.leaderId === currentUser.id;
            const alreadyMember = currentUser
              ? storage.getTeamMembers(team.teamCode).some((m) => m.userId === currentUser.id)
              : false;
            const isMyTeam = !!(isLeader || alreadyMember);
            const pendingCount = isLeader
              ? storage.getJoinRequestsForTeam(team.teamCode).filter((r) => r.status === 'pending').length
              : 0;
            const hasPendingRequest = currentUser
              ? storage.getJoinRequests().some((r) => r.teamCode === team.teamCode && r.fromUserId === currentUser.id && r.status === 'pending')
              : false;

            const handleCardClick = () => {
              if (!currentUser) {
                router.push('/auth/login');
                return;
              }
              if (isMyTeam) {
                router.push(`/teams/${team.teamCode}`);
                return;
              }
              if (team.isOpen) setJoinTarget(team);
            };

            return (
              <Card
                key={team.teamCode}
                className="flex flex-col gap-3 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
                onClick={handleCardClick}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{team.name}</h3>
                      {isMyTeam && (
                        <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700 font-medium">
                          {isLeader ? '내 팀' : '합류됨'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{hackathon?.title ?? team.hackathonSlug}</p>
                  </div>
                  <span
                    className={`shrink-0 ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                      team.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {team.isOpen ? '모집중' : '마감'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{team.intro}</p>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  {team.memberCount} / {team.maxMembers}명
                </div>

                {team.lookingFor.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {team.lookingFor.map((pos) => (
                      <Badge key={pos}>{pos}</Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                  {isLeader ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setManagingTeam(team)}
                      className="flex-1 relative"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      팀 관리
                      {pendingCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                          {pendingCount}
                        </span>
                      )}
                    </Button>
                  ) : alreadyMember ? (
                    <span className="flex-1 text-center text-xs text-violet-600 font-medium py-1.5 bg-violet-50 rounded-lg">
                      합류된 팀
                    </span>
                  ) : hasPendingRequest ? (
                    <span className="flex-1 text-center text-xs text-gray-500 font-medium py-1.5 bg-gray-50 rounded-lg">
                      신청 대기 중
                    </span>
                  ) : team.isOpen ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setJoinTarget(team)}
                      className="flex-1"
                    >
                      합류 요청
                    </Button>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {createOpen && (
        <CreateTeamModal
          hackathons={hackathons.filter((h) => h.status !== 'ended')}
          onClose={() => setCreateOpen(false)}
          onCreated={(team) => setLocalTeams((prev) => [team, ...prev])}
        />
      )}
      {joinTarget && <JoinRequestModal team={joinTarget} onClose={() => setJoinTarget(null)} />}
      {managingTeam && (
        <TeamRequestsPanel
          team={managingTeam}
          onClose={() => setManagingTeam(null)}
          onTeamUpdated={handleTeamUpdated}
        />
      )}
    </div>
  );
}

export default function CampPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CampContent />
    </Suspense>
  );
}
