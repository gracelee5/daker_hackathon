'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Award, Clock, BarChart2, Users, LogOut } from 'lucide-react';
import { storage } from '@/lib/storage';
import { UserProfile, HackathonParticipation, ActivityCertificate, Team } from '@/types';
import { getHackathons } from '@/lib/data';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { LoadingSpinner, EmptyState } from '@/components/common/StatusUI';
import CertificateCard from './CertificateCard';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [participations, setParticipations] = useState<HackathonParticipation[]>([]);
  const [certificates, setCertificates] = useState<ActivityCertificate[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const hackathons = getHackathons();

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (user) {
      setProfile(user);
      setParticipations(storage.getParticipations());
      setCertificates(storage.getCertificates());
      // 내가 만든 팀 + 합류 승인된 팀
      const allTeams = storage.getTeams();
      const myCreated = allTeams.filter((t) => t.leaderId === user.id);
      setMyTeams(myCreated);
    }
    setLoading(false);
  }, [id]);

  const handleLogout = () => {
    storage.logout();
    router.push('/');
  };

  if (loading) return <LoadingSpinner />;

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <EmptyState
          title="로그인이 필요합니다"
          description="프로필을 보려면 먼저 로그인해 주세요."
          action={
            <Button onClick={() => router.push('/auth/login')}>로그인하기</Button>
          }
        />
      </div>
    );
  }

  const positionCount: Record<string, number> = {};
  participations.forEach((p) => {
    positionCount[p.role] = (positionCount[p.role] ?? 0) + 1;
  });
  // 포지션이 없으면 profile.positions 기반으로 기본 표시
  if (Object.keys(positionCount).length === 0) {
    profile.positions.forEach((pos) => { positionCount[pos] = 1; });
  }
  const totalPositions = Object.values(positionCount).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* 프로필 헤더 */}
      <Card>
        <div className="flex items-start gap-5">
          <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
            <User className="h-8 w-8 text-violet-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{profile.nickname}</h1>
                <p className="text-sm text-gray-500 mt-0.5">{profile.bio || '소개가 없습니다.'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">누적 포인트</p>
                <p className="text-2xl font-bold text-violet-600">{profile.totalPoints.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {profile.positions.map((pos) => (
                <Badge key={pos}>{pos}</Badge>
              ))}
            </div>
          </div>
        </div>
        {/* 로그아웃 */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg px-3 py-1.5 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </Card>

      {/* 포지션 비중 */}
      <Card>
        <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
          <BarChart2 className="h-4 w-4 text-violet-500" /> 포지션 비중
        </div>
        <div className="space-y-3">
          {Object.entries(positionCount)
            .sort(([, a], [, b]) => b - a)
            .map(([pos, count]) => (
              <div key={pos}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{pos}</span>
                  <span className="text-gray-500">{Math.round((count / totalPositions) * 100)}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-400"
                    style={{ width: `${(count / totalPositions) * 100}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* 나의 팀 */}
      <Card>
        <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
          <Users className="h-4 w-4 text-violet-500" /> 나의 팀
        </div>
        {myTeams.length === 0 ? (
          <EmptyState
            title="참여 중인 팀이 없습니다"
            description="팀을 만들거나 팀에 합류해 보세요."
            action={
              <Link href="/camp">
                <Button size="sm" variant="secondary">팀 모집 페이지로</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {myTeams.map((team) => {
              const hackathon = hackathons.find((h) => h.slug === team.hackathonSlug);
              return (
                <Link key={team.teamCode} href="/camp">
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 hover:border-violet-200 hover:bg-violet-50/30 transition-colors cursor-pointer">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{team.name}</p>
                        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700 font-medium">팀장</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{hackathon?.title ?? team.hackathonSlug}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{team.memberCount} / {team.maxMembers}명</p>
                      <span className={`text-xs font-medium ${team.isOpen ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {team.isOpen ? '모집중' : '마감'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>

      {/* 활동 타임라인 */}
      <Card>
        <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
          <Clock className="h-4 w-4 text-violet-500" /> 참여 이력
        </div>
        {participations.length === 0 ? (
          <EmptyState
            title="참여 이력이 없습니다"
            description="해커톤에 참가하면 여기에 기록됩니다."
          />
        ) : (
          <ol className="relative border-l border-gray-200 ml-2 space-y-5">
            {participations.map((p, i) => (
              <li key={i} className="ml-4">
                <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border-2 border-violet-400 bg-white" />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{p.hackathonTitle}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.teamName} · {p.role}</p>
                    {p.result && (
                      <p className="text-xs text-violet-600 mt-0.5">
                        {p.result.rank}위 / {p.result.totalTeams}팀 · {p.result.score}점
                      </p>
                    )}
                  </div>
                  <Badge variant="status" status={p.status} />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(p.joinedAt).toLocaleDateString('ko-KR')}
                </p>
              </li>
            ))}
          </ol>
        )}
      </Card>

      {/* 경험 증명서 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold text-gray-900">경험 증명서</h2>
        </div>
        {certificates.length === 0 ? (
          <EmptyState
            title="아직 발급된 증명서가 없습니다"
            description="해커톤에 참가하고 제출하면 증명서가 자동 발급됩니다."
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <CertificateCard key={cert.id} certificate={cert} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
