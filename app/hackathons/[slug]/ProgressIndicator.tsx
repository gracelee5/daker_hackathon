'use client';

import { Hackathon } from '@/types';

interface Milestone {
  name: string;
  at: string;
}

interface Props {
  hackathon: Hackathon;
  milestones: Milestone[];
}

export default function ProgressIndicator({ hackathon, milestones }: Props) {
  const now = Date.now();
  const start = new Date(milestones[0]?.at ?? hackathon.period.submissionDeadlineAt).getTime();
  const end = new Date(hackathon.period.endAt).getTime();
  const total = end - start;
  const elapsed = Math.min(Math.max(now - start, 0), total);
  const percent = total > 0 ? Math.round((elapsed / total) * 100) : 0;

  const STATUS_LABEL: Record<string, string> = {
    ongoing: '진행중',
    upcoming: '시작 전',
    ended: '종료',
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>
          {new Date(milestones[0]?.at ?? start).toLocaleDateString('ko-KR')}
        </span>
        <span className="font-medium text-violet-600">{STATUS_LABEL[hackathon.status] ?? hackathon.status}</span>
        <span>{new Date(end).toLocaleDateString('ko-KR')}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-violet-500 transition-all"
          style={{ width: `${hackathon.status === 'ended' ? 100 : hackathon.status === 'upcoming' ? 0 : percent}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">
        제출 마감: {new Date(hackathon.period.submissionDeadlineAt).toLocaleString('ko-KR')}
      </p>
    </div>
  );
}
