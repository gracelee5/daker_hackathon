'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Award, Clock, BarChart2, Users, LogOut, Pencil, Settings, X, Check } from 'lucide-react';
import { storage } from '@/lib/storage';
import { useAuthStore } from '@/store/authStore';
import { HackathonParticipation, ActivityCertificate, Team } from '@/types';
import { getHackathons } from '@/lib/data';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { LoadingSpinner, EmptyState } from '@/components/common/StatusUI';
import CertificateCard from './CertificateCard';

const POSITIONS = ['Frontend', 'Backend', 'Designer', 'PM', 'ML Engineer', 'DevOps'];

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { user, ready, logout, updateUser } = useAuthStore();
  const [participations, setParticipations] = useState<HackathonParticipation[]>([]);
  const [certificates, setCertificates] = useState<ActivityCertificate[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);

  // 편집 모달
  const [editOpen, setEditOpen] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editPositions, setEditPositions] = useState<string[]>([]);

  const hackathons = getHackathons();

  useEffect(() => {
    if (!ready) return;
    if (user) {
      setParticipations(storage.getParticipations());
      setCertificates(storage.getCertificates().filter((c) => c.userId === user.id));
      const allTeams = storage.getTeams();
      const myCreated = allTeams.filter((t) => t.leaderId === user.id);
      setMyTeams(myCreated);
    }
  }, [id, user, ready]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const openEdit = () => {
    if (!user) return;
    setEditNickname(user.nickname);
    setEditBio(user.bio);
    setEditPositions([...user.positions]);
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editNickname.trim()) return;
    updateUser({ nickname: editNickname.trim(), bio: editBio.trim(), positions: editPositions, techStack: editPositions });
    setEditOpen(false);
  };

  const toggleEditPosition = (pos: string) => {
    setEditPositions((prev) => prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]);
  };

  if (!ready) return <LoadingSpinner />;

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <EmptyState
          title="로그인이 필요합니다"
          description="프로필을 보려면 먼저 로그인해 주세요."
          action={<Button onClick={() => router.push('/auth/login')}>로그인하기</Button>}
        />
      </div>
    );
  }

  const positionCount: Record<string, number> = {};
  participations.forEach((p) => {
    if (p.role) positionCount[p.role] = (positionCount[p.role] ?? 0) + 1;
  });
  if (Object.keys(positionCount).length === 0) {
    user.positions.forEach((pos) => { positionCount[pos] = 1; });
  }
  const totalPositions = Object.values(positionCount).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* 편집 모달 */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">프로필 편집</h2>
              <button onClick={() => setEditOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                <input
                  type="text"
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">한 줄 소개</label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">포지션</label>
                <div className="flex flex-wrap gap-2">
                  {POSITIONS.map((pos) => (
                    <button
                      key={pos}
                      onClick={() => toggleEditPosition(pos)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        editPositions.includes(pos)
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
            <div className="flex gap-2 mt-6">
              <Button variant="secondary" onClick={() => setEditOpen(false)} className="flex-1">취소</Button>
              <Button onClick={handleSaveEdit} className="flex-1" disabled={!editNickname.trim()}>
                <Check className="h-4 w-4" /> 저장
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 프로필 헤더 */}
      <Card>
        <div className="flex items-start gap-5">
          <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
            <User className="h-8 w-8 text-violet-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{user.nickname}</h1>
                <p className="text-sm text-gray-500 mt-0.5">{user.bio || '소개가 없습니다.'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">누적 포인트</p>
                <p className="text-2xl font-bold text-violet-600">{user.totalPoints.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {user.positions.map((pos) => (
                <Badge key={pos}>{pos}</Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={openEdit}
            className="flex items-center gap-1.5 text-sm text-violet-600 hover:bg-violet-50 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Pencil className="h-4 w-4" /> 프로필 편집
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg px-3 py-1.5 transition-colors"
          >
            <LogOut className="h-4 w-4" /> 로그아웃
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
                <div key={team.teamCode} className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 hover:border-violet-200 transition-colors">
                  <Link href={`/teams/${team.teamCode}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{team.name}</p>
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700 font-medium">팀장</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{hackathon?.title ?? team.hackathonSlug}</p>
                    <p className="text-xs text-gray-500">{team.memberCount} / {team.maxMembers}명 · {team.isOpen ? '모집중' : '마감'}</p>
                  </Link>
                  <Link
                    href={`/camp?manage=${team.teamCode}`}
                    className="ml-3 rounded-lg p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                    title="팀 관리"
                  >
                    <Settings className="h-4 w-4" />
                  </Link>
                </div>
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
                <Link href={`/hackathons/${p.hackathonSlug}`} className="block hover:bg-gray-50 rounded-lg p-1 -mx-1 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm hover:text-violet-700 transition-colors">{p.hackathonTitle}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{p.teamName}{p.role ? ` · ${p.role}` : ''}</p>
                      {p.result && (
                        <p className="text-xs text-violet-600 mt-0.5">
                          {p.result.rank}위 / {p.result.totalTeams}팀 · {p.result.score}점
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <Badge variant="status" status={p.status} />
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        p.submitted
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {p.submitted ? '제출 완료' : '제출 전'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(p.joinedAt).toLocaleDateString('ko-KR')}
                  </p>
                </Link>
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
