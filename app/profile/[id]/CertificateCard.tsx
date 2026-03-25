'use client';

import { Award, ExternalLink, Share2 } from 'lucide-react';
import { ActivityCertificate } from '@/types';
import Card from '@/components/common/Card';

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
    <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
      <div className="flex items-start justify-between mb-3">
        <Award className="h-7 w-7 text-amber-500" />
        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-violet-600 transition-colors"
        >
          <Share2 className="h-3.5 w-3.5" /> 공유
        </button>
      </div>
      <p className="text-xs text-amber-600 font-medium mb-1">Activity Certificate</p>
      <h3 className="font-bold text-gray-900 mb-0.5 text-sm line-clamp-2">{cert.hackathonTitle}</h3>
      <p className="text-sm text-gray-700 mb-3">
        {cert.teamName} · <span className="text-violet-600">{cert.role}</span>
      </p>

      {cert.rank && (
        <p className="text-xs text-gray-500 mb-2">
          최종 순위: <span className="font-semibold text-amber-600">{cert.rank}위</span>
          {cert.totalTeams && ` / ${cert.totalTeams}팀`}
        </p>
      )}
      {cert.score !== undefined && (
        <p className="text-xs text-gray-500 mb-2">
          점수: <span className="font-semibold">{cert.score}</span>
        </p>
      )}

      {cert.artifacts?.webUrl && (
        <a
          href={cert.artifacts.webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-violet-600 hover:underline"
        >
          <ExternalLink className="h-3 w-3" /> 프로젝트 보기
        </a>
      )}

      <p className="text-xs text-gray-400 mt-3">
        발급일: {new Date(cert.issuedAt).toLocaleDateString('ko-KR')}
      </p>
    </Card>
  );
}
