import Link from 'next/link';
import { Trophy, ExternalLink, ArrowRight } from 'lucide-react';
import { getAllLeaderboardEntries, getHackathons } from '@/lib/data';
import Card from '@/components/common/Card';
import { EmptyState } from '@/components/common/StatusUI';

interface GlobalEntry {
  rank: number;
  teamName: string;
  score: number;
  hackathonTitle: string;
  hackathonSlug: string;
  submittedAt: string;
  scoreBreakdown?: { participant: number; judge: number };
  artifacts?: { webUrl?: string; pdfUrl?: string; planTitle?: string };
}

function buildGlobalRanking(): GlobalEntry[] {
  const hackathons = getHackathons();
  const leaderboards = getAllLeaderboardEntries();

  const entries: GlobalEntry[] = leaderboards.flatMap((lb) => {
    const hackathon = hackathons.find((h) => h.slug === lb.hackathonSlug);
    return lb.entries.map((e) => ({
      rank: 0,
      teamName: e.teamName,
      score: e.score,
      hackathonTitle: hackathon?.title ?? lb.hackathonSlug,
      hackathonSlug: lb.hackathonSlug,
      submittedAt: e.submittedAt,
      scoreBreakdown: e.scoreBreakdown,
      artifacts: e.artifacts,
    }));
  });

  entries.sort((a, b) => b.score - a.score);
  entries.forEach((e, i) => (e.rank = i + 1));
  return entries;
}

const RANK_STYLES: Record<number, string> = {
  1: 'bg-amber-50 border-amber-200',
  2: 'bg-gray-50 border-gray-200',
  3: 'bg-orange-50 border-orange-200',
};

const RANK_ICONS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function RankingsPage() {
  const entries = buildGlobalRanking();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="h-6 w-6 text-amber-500" />
        <h1 className="text-2xl font-bold text-gray-900">글로벌 랭킹</h1>
      </div>

      {entries.length === 0 ? (
        <EmptyState title="아직 순위 데이터가 없습니다" />
      ) : (
        <>
          {/* 상위 3위 하이라이트 */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {entries.slice(0, 3).map((entry) => (
              <Link
                key={`${entry.hackathonSlug}-${entry.teamName}`}
                href={`/hackathons/${entry.hackathonSlug}#leaderboard`}
              >
                <Card
                  className={`text-center border hover:shadow-md transition-shadow cursor-pointer ${RANK_STYLES[entry.rank] ?? ''}`}
                >
                  <div className="text-3xl mb-2">{RANK_ICONS[entry.rank]}</div>
                  <p className="font-bold text-gray-900">{entry.teamName}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{entry.hackathonTitle}</p>
                  <p className="text-lg font-semibold text-violet-700 mt-2">{entry.score}</p>
                </Card>
              </Link>
            ))}
          </div>

          {/* 전체 순위 테이블 */}
          <Card padding="none">
            <div className="divide-y divide-gray-100">
              {entries.map((entry) => (
                <div
                  key={`${entry.hackathonSlug}-${entry.teamName}`}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <span className={`w-8 shrink-0 text-center text-sm font-bold ${entry.rank <= 3 ? 'text-amber-500' : 'text-gray-400'}`}>
                    {entry.rank <= 3 ? RANK_ICONS[entry.rank] : entry.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{entry.teamName}</p>
                    <Link
                      href={`/hackathons/${entry.hackathonSlug}`}
                      className="text-xs text-violet-500 hover:underline truncate block"
                    >
                      {entry.hackathonTitle}
                    </Link>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-violet-700">{entry.score}</p>
                    {entry.scoreBreakdown && (
                      <p className="text-xs text-gray-400">
                        참가자 {entry.scoreBreakdown.participant} / 심사 {entry.scoreBreakdown.judge}
                      </p>
                    )}
                  </div>
                  {/* 제출물 외부 URL이 있으면 아이콘 링크, 없으면 해커톤 상세로 이동 */}
                  {entry.artifacts?.webUrl ? (
                    <a
                      href={entry.artifacts.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                      title="제출물 보기"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link
                      href={`/hackathons/${entry.hackathonSlug}#leaderboard`}
                      className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                      title="해커톤 상세 보기"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
