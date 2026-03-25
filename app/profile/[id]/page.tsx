'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { User, Award, Clock, BarChart2 } from 'lucide-react';
import { storage } from '@/lib/storage';
import { UserProfile, HackathonParticipation, ActivityCertificate } from '@/types';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { LoadingSpinner, EmptyState } from '@/components/common/StatusUI';
import CertificateCard from './CertificateCard';
import ProfileSetupModal from './ProfileSetupModal';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: Props) {
  const { id } = use(params);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [participations, setParticipations] = useState<HackathonParticipation[]>([]);
  const [certificates, setCertificates] = useState<ActivityCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [setupOpen, setSetupOpen] = useState(false);

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (user) {
      setProfile(user);
      setParticipations(storage.getParticipations());
      setCertificates(storage.getCertificates());
    } else if (id === 'me') {
      setSetupOpen(true);
    }
    setLoading(false);
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <EmptyState
          title="프로필이 없습니다"
          description="프로필을 설정하여 활동 내역을 관리하세요."
          action={
            <button
              onClick={() => setSetupOpen(true)}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white font-medium hover:bg-violet-700"
            >
              프로필 만들기
            </button>
          }
        />
        {setupOpen && (
          <ProfileSetupModal
            onSave={(p) => {
              storage.setCurrentUser(p);
              setProfile(p);
              setSetupOpen(false);
            }}
            onClose={() => setSetupOpen(false)}
          />
        )}
      </div>
    );
  }

  // 기술 스택 비중 계산 (참여 포지션 기준)
  const positionCount: Record<string, number> = {};
  participations.forEach((p) => {
    positionCount[p.role] = (positionCount[p.role] ?? 0) + 1;
  });
  const totalParticipations = participations.length || 1;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* 프로필 헤더 */}
      <Card className="flex items-start gap-5">
        <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
          <User className="h-8 w-8 text-violet-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{profile.nickname}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{profile.bio}</p>
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
      </Card>

      {/* 기술 스택 비중 */}
      {Object.keys(positionCount).length > 0 && (
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
                    <span className="text-gray-500">{Math.round((count / totalParticipations) * 100)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-400"
                      style={{ width: `${(count / totalParticipations) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* 활동 타임라인 */}
      <Card>
        <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
          <Clock className="h-4 w-4 text-violet-500" /> 참여 이력
        </div>
        {participations.length === 0 ? (
          <EmptyState title="참여 이력이 없습니다" />
        ) : (
          <ol className="relative border-l border-gray-200 ml-2 space-y-5">
            {participations.map((p, i) => (
              <li key={i} className="ml-4">
                <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border-2 border-violet-400 bg-white" />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{p.hackathonTitle}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {p.teamName} · {p.role}
                    </p>
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
