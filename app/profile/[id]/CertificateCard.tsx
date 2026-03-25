'use client';

import { Award, Share2, ExternalLink, Zap } from 'lucide-react';
import { ActivityCertificate } from '@/types';

interface Props {
  certificate: ActivityCertificate;
}

export default function CertificateCard({ certificate: cert }: Props) {
  const handleShare = async () => {
    const text = `[Sync-Up 경험 증명서] ${cert.hackathonTitle} - ${cert.teamName} (${cert.role})${cert.rank ? ` · ${cert.rank}위` : ''}`;
    if (navigator.share) {
      await navigator.share({ title: 'Sync-Up 경험 증명서', text });
    } else {
      await navigator.clipboard.writeText(text);
      alert('클립보드에 복사되었습니다.');
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-violet-50 shadow-sm">
      {/* 상단 장식 배너 */}
      <div className="bg-gradient-to-r from-violet-600 to-amber-500 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-white" />
          <span className="text-white text-xs font-bold tracking-wider uppercase">Sync-Up</span>
        </div>
        <span className="text-white/80 text-xs font-medium">Activity Certificate</span>
      </div>

      {/* 본문 */}
      <div className="px-5 py-4">
        {/* 메달 아이콘 */}
        <div className="flex items-start justify-between mb-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
            <Award className="h-6 w-6 text-white" />
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-violet-600 transition-colors mt-1"
          >
            <Share2 className="h-3.5 w-3.5" /> 공유
          </button>
        </div>

        {/* 해커톤 이름 */}
        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">{cert.hackathonTitle}</h3>

        {/* 팀 / 역할 */}
        <p className="text-sm text-gray-600 mb-3">
          {cert.teamName} &middot; <span className="font-medium text-violet-700">{cert.role}</span>
        </p>

        {/* 순위 / 점수 */}
        {cert.rank && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
              {cert.rank}위{cert.totalTeams ? ` / ${cert.totalTeams}팀` : ''}
            </span>
            {cert.score !== undefined && (
              <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                {cert.score}점
              </span>
            )}
          </div>
        )}

        {/* 프로젝트 링크 */}
        {cert.artifacts?.webUrl && (
          <a
            href={cert.artifacts.webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-violet-600 hover:underline mb-2"
          >
            <ExternalLink className="h-3 w-3" /> 프로젝트 보기
          </a>
        )}

        {/* 발급일 */}
        <div className="border-t border-amber-100 mt-3 pt-2.5 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            발급일: <span className="font-medium">{new Date(cert.issuedAt).toLocaleDateString('ko-KR')}</span>
          </p>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`h-1 w-1 rounded-full ${i < 3 ? 'bg-amber-400' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
