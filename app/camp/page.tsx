'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Users, Plus } from 'lucide-react';
import { getHackathons, getPublicTeams } from '@/lib/data';
import { storage } from '@/lib/storage';
import { Team } from '@/types';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { EmptyState, LoadingSpinner } from '@/components/common/StatusUI';
import CreateTeamModal from './CreateTeamModal';
import JoinRequestModal from './JoinRequestModal';

const POSITIONS = ['Frontend', 'Backend', 'Designer', 'PM', 'ML Engineer', 'DevOps'];

function CampContent() {
  const searchParams = useSearchParams();
  const hackathonFilter = searchParams.get('hackathon') ?? 'all';

  const hackathons = getHackathons();
  const publicTeams = getPublicTeams();
  const [localTeams] = useState<Team[]>(() => storage.getTeams());
  const allTeams = useMemo(() => {
    const codes = new Set(publicTeams.map((t) => t.teamCode));
    return [...publicTeams, ...localTeams.filter((t) => !codes.has(t.teamCode))];
  }, [publicTeams, localTeams]);

  const [hackathonSlug, setHackathonSlug] = useState(hackathonFilter);
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [showOpen, setShowOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinTarget, setJoinTarget] = useState<Team | null>(null);

  const filtered = useMemo(() => {
    return allTeams.filter((t) => {
      if (hackathonSlug !== 'all' && t.hackathonSlug !== hackathonSlug) return false;
      if (positionFilter !== 'all' && !t.lookingFor.includes(positionFilter)) return false;
      if (showOpen && !t.isOpen) return false;
      return true;
    });
  }, [allTeams, hackathonSlug, positionFilter, showOpen]);

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
            return (
              <Card key={team.teamCode} className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{team.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{hackathon?.title ?? team.hackathonSlug}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      team.isOpen
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {team.isOpen ? '모집중' : '마감'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{team.intro}</p>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  {team.memberCount}명
                </div>

                {team.lookingFor.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {team.lookingFor.map((pos) => (
                      <Badge key={pos}>{pos}</Badge>
                    ))}
                  </div>
                )}

                {team.isOpen && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setJoinTarget(team)}
                    className="mt-auto"
                  >
                    합류 요청
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {createOpen && <CreateTeamModal hackathons={hackathons} onClose={() => setCreateOpen(false)} />}
      {joinTarget && <JoinRequestModal team={joinTarget} onClose={() => setJoinTarget(null)} />}
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
