import Link from 'next/link';
import Image from 'next/image';
import { Zap, Users, Trophy, ArrowRight, ChevronRight } from 'lucide-react';
import { getHackathons } from '@/lib/data';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';

const QUICK_MENUS = [
  {
    href: '/hackathons',
    icon: Zap,
    label: '해커톤 탐색',
    desc: '진행중·예정·종료 해커톤 전체 보기',
    color: 'text-violet-600 bg-violet-50',
  },
  {
    href: '/camp',
    icon: Users,
    label: '팀원 모집',
    desc: '포지션별 팀을 찾거나 모집글 올리기',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    href: '/rankings',
    icon: Trophy,
    label: '글로벌 랭킹',
    desc: '포인트 기반 참가자 순위 확인',
    color: 'text-amber-600 bg-amber-50',
  },
];

export default function HomePage() {
  const hackathons = getHackathons();
  const popular = hackathons.filter((h) => h.status !== 'ended').slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* 히어로 */}
      <section className="text-center py-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 mb-6">
          <Zap className="h-4 w-4" />
          해커톤 통합 성장 플랫폼
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          해커톤, 단순한 참여를<br className="hidden sm:block" /> 넘어
          <span className="text-violet-600"> 당신의 성장</span>이<br className="hidden sm:block" /> 기록되는 곳
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
          팀을 구성하고, 결과를 제출하고, 경험 증명서로 커리어를 쌓으세요.
        </p>
        <Link
          href="/hackathons"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-white font-semibold hover:bg-violet-700 transition-colors"
        >
          해커톤 둘러보기 <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* 퀵 메뉴 */}
      <section className="grid sm:grid-cols-3 gap-4 mb-12">
        {QUICK_MENUS.map(({ href, icon: Icon, label, desc, color }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className={`inline-flex rounded-lg p-2.5 mb-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-semibold text-gray-900 mb-1">{label}</p>
              <p className="text-sm text-gray-500">{desc}</p>
            </Card>
          </Link>
        ))}
      </section>

      {/* 인기 해커톤 */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">주목할 해커톤</h2>
          <Link
            href="/hackathons"
            className="flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700 font-medium"
          >
            전체 보기 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {popular.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">현재 진행 중인 해커톤이 없습니다.</p>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popular.map((h) => (
              <Link key={h.slug} href={`/hackathons/${h.slug}`}>
                <Card padding="none" className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative h-36 bg-gradient-to-br from-violet-100 to-blue-100">
                    {h.thumbnailUrl ? (
                      <Image src={h.thumbnailUrl} alt={h.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Zap className="h-10 w-10 text-violet-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="status" status={h.status} />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{h.title}</h3>
                    <div className="flex flex-wrap gap-1">
                      {h.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="tag">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
