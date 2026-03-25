import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getHackathonBySlug, getHackathonDetail, getLeaderboard } from '@/lib/data';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import { EmptyState } from '@/components/common/StatusUI';
import ProgressIndicator from './ProgressIndicator';
import SubmitSection from './SubmitSection';
import { Calendar, Trophy, Users, FileText, Info, BarChart2, ExternalLink } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function HackathonDetailPage({ params }: Props) {
  const { slug } = await params;
  const hackathon = getHackathonBySlug(slug);
  const detail = getHackathonDetail(slug);

  if (!hackathon || !detail) notFound();

  const leaderboard = getLeaderboard(slug);
  const { sections } = detail;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 썸네일 */}
      <div className="relative h-52 w-full rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-violet-100 to-blue-100">
        {hackathon.thumbnailUrl && (
          <Image
            src={hackathon.thumbnailUrl}
            alt={hackathon.title}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="status" status={hackathon.status} />
          {hackathon.tags.map((tag) => (
            <Badge key={tag} variant="tag">{tag}</Badge>
          ))}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{hackathon.title}</h1>
        <ProgressIndicator hackathon={hackathon} milestones={sections.schedule.milestones} />
      </div>

      <div className="space-y-6">
        {/* 1. 개요 */}
        <Card>
          <div className="flex items-center gap-2 mb-3 font-semibold text-gray-900">
            <Info className="h-4 w-4 text-violet-500" /> 개요
          </div>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">{sections.overview.summary}</p>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>솔로 참가: {sections.overview.teamPolicy.allowSolo ? '가능' : '불가'}</span>
            <span>최대 팀원: {sections.overview.teamPolicy.maxTeamSize}명</span>
          </div>
        </Card>

        {/* 2. 공지 및 링크 */}
        <Card>
          <div className="flex items-center gap-2 mb-3 font-semibold text-gray-900">
            <FileText className="h-4 w-4 text-violet-500" /> 안내
          </div>
          <ul className="space-y-2 mb-4">
            {sections.info.notice.map((n, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-violet-400 mt-0.5">•</span>
                {n}
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <a
              href={sections.info.links.rules}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-violet-600 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" /> 규정
            </a>
            <a
              href={sections.info.links.faq}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-violet-600 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" /> FAQ
            </a>
          </div>
        </Card>

        {/* 3. 평가 기준 */}
        <Card>
          <div className="flex items-center gap-2 mb-3 font-semibold text-gray-900">
            <BarChart2 className="h-4 w-4 text-violet-500" /> 평가 기준
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">{sections.eval.metricName}</p>
          <p className="text-sm text-gray-600 mb-3">{sections.eval.description}</p>
          {sections.eval.limits && (
            <div className="flex gap-4 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
              <span>최대 실행시간: {sections.eval.limits.maxRuntimeSec}초</span>
              <span>일일 최대 제출: {sections.eval.limits.maxSubmissionsPerDay}회</span>
            </div>
          )}
          {sections.eval.scoreDisplay && (
            <div className="flex gap-3 mt-2">
              {sections.eval.scoreDisplay.breakdown.map((b) => (
                <div key={b.key} className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">{b.label}</p>
                  <p className="font-semibold text-violet-700">{b.weightPercent}%</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 4. 일정 */}
        <Card>
          <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
            <Calendar className="h-4 w-4 text-violet-500" /> 일정
          </div>
          <ol className="relative border-l border-gray-200 ml-2 space-y-4">
            {sections.schedule.milestones.map((m, i) => (
              <li key={i} className="ml-4">
                <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border-2 border-violet-400 bg-white" />
                <p className="text-xs text-gray-400 mb-0.5">
                  {new Date(m.at).toLocaleDateString('ko-KR', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
                <p className="text-sm font-medium text-gray-900">{m.name}</p>
              </li>
            ))}
          </ol>
        </Card>

        {/* 5. 상금 */}
        {sections.prize && (
          <Card>
            <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
              <Trophy className="h-4 w-4 text-amber-500" /> 상금
            </div>
            <div className="flex gap-3 flex-wrap">
              {sections.prize.items.map((item) => (
                <div key={item.place} className="flex-1 min-w-24 bg-amber-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-amber-600 font-medium mb-1">{item.place}</p>
                  <p className="font-bold text-amber-800">
                    {item.amountKRW.toLocaleString('ko-KR')}원
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 6. 팀 모집 */}
        {sections.teams.campEnabled && (
          <Card>
            <div className="flex items-center gap-2 mb-3 font-semibold text-gray-900">
              <Users className="h-4 w-4 text-violet-500" /> 팀 모집
            </div>
            <p className="text-sm text-gray-600 mb-4">이 해커톤에서 팀원을 모집하거나 팀에 합류하세요.</p>
            <Link
              href={sections.teams.listUrl}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white font-medium hover:bg-violet-700 transition-colors"
            >
              <Users className="h-4 w-4" /> 팀 목록 보기
            </Link>
          </Card>
        )}

        {/* 7. 제출 */}
        <SubmitSection slug={slug} submit={sections.submit} />

        {/* 리더보드 */}
        <Card id="leaderboard">
          <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
            <Trophy className="h-4 w-4 text-violet-500" /> 리더보드
          </div>
          {sections.leaderboard.note && (
            <p className="text-xs text-gray-500 mb-4">{sections.leaderboard.note}</p>
          )}
          {!leaderboard || leaderboard.entries.length === 0 ? (
            <EmptyState title="아직 제출된 결과가 없습니다" />
          ) : (
            <div className="space-y-2">
              {leaderboard.entries.map((entry) => (
                <div
                  key={entry.rank}
                  className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3"
                >
                  <span className={`w-6 text-center text-sm font-bold ${entry.rank <= 3 ? 'text-amber-500' : 'text-gray-400'}`}>
                    {entry.rank}
                  </span>
                  <span className="flex-1 text-sm font-medium text-gray-900">{entry.teamName}</span>
                  <span className="text-sm font-semibold text-violet-700">{entry.score}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
