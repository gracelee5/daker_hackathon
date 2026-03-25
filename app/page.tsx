import Link from 'next/link';
import Image from 'next/image';
import { Zap, Users, Trophy, ArrowRight, ChevronRight, Code2, Award, BarChart2 } from 'lucide-react';
import { getHackathons } from '@/lib/data';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';

const QUICK_MENUS = [
  {
    href: '/hackathons',
    icon: Zap,
    label: '해커톤 탐색',
    desc: '진행 중·예정·종료 해커톤 전체 보기',
    color: 'text-violet-600 bg-violet-50',
    border: 'border-violet-100',
  },
  {
    href: '/camp',
    icon: Users,
    label: '팀원 모집',
    desc: '포지션별 팀을 찾거나 모집글 올리기',
    color: 'text-blue-600 bg-blue-50',
    border: 'border-blue-100',
  },
  {
    href: '/rankings',
    icon: Trophy,
    label: '글로벌 랭킹',
    desc: '포인트 기반 참가자 순위 확인',
    color: 'text-amber-600 bg-amber-50',
    border: 'border-amber-100',
  },
];

const FEATURES = [
  { icon: Code2, label: '해커톤 참가', desc: '다양한 주제의 해커톤에 참가하고 실력을 키우세요.' },
  { icon: Users, label: '팀 빌딩', desc: '포지션별 팀원을 모집하거나 팀에 합류하세요.' },
  { icon: Award, label: '증명서 발급', desc: '제출 완료 시 경험 증명서가 자동으로 발급됩니다.' },
  { icon: BarChart2, label: '성장 기록', desc: '참여 이력과 포인트로 나의 성장을 확인하세요.' },
];

export default function HomePage() {
  const hackathons = getHackathons();
  const popular = hackathons.filter((h) => h.status !== 'ended').slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-violet-800 to-indigo-700 text-white">
        {/* 배경 장식 */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute bottom-0 -left-16 h-64 w-64 rounded-full bg-indigo-400/20 blur-2xl" />
          {/* 그리드 패턴 */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* 텍스트 */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium text-violet-200 mb-6 backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5 text-yellow-300" />
                해커톤 통합 성장 플랫폼
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
                해커톤, 단순한 참여를<br />
                넘어<span className="text-yellow-300"> 당신의 성장</span>이<br />
                기록되는 곳
              </h1>
              <p className="text-violet-200 text-lg max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                팀을 구성하고, 결과를 제출하고,<br className="hidden sm:block" />
                경험 증명서로 커리어를 쌓으세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/hackathons"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-violet-700 font-semibold hover:bg-violet-50 transition-colors shadow-lg"
                >
                  해커톤 둘러보기 <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/camp"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-white font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  팀 모집 보기
                </Link>
              </div>
            </div>

            {/* 일러스트 영역 — SVG 캐릭터/아이콘 */}
            <div className="flex-shrink-0 relative w-72 h-72 lg:w-80 lg:h-80">
              {/* 배경 원 */}
              <div className="absolute inset-0 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm" />
              {/* 중앙 번개 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-400 flex items-center justify-center shadow-2xl rotate-3">
                    <Zap className="h-14 w-14 text-violet-900" />
                  </div>
                  {/* 플로팅 뱃지들 */}
                  <div className="absolute -top-6 -right-8 bg-emerald-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
                    진행 중
                  </div>
                  <div className="absolute -bottom-4 -left-10 bg-white text-violet-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <Award className="h-3 w-3" /> 증명서 발급
                  </div>
                  <div className="absolute top-1/2 -left-14 -translate-y-1/2 bg-indigo-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <Users className="h-3 w-3" /> 팀 모집
                  </div>
                </div>
              </div>
              {/* 장식 점들 */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-2 w-2 rounded-full bg-white/40"
                  style={{
                    top: `${15 + Math.sin(i * Math.PI / 4) * 43 + 43}%`,
                    left: `${15 + Math.cos(i * Math.PI / 4) * 43 + 43}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* 통계 */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
            {[
              { value: '8+', label: '해커톤' },
              { value: '9+', label: '팀 모집' },
              { value: '100+', label: '참가자' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center rounded-xl bg-white/10 border border-white/20 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold text-yellow-300">{value}</p>
                <p className="text-xs text-violet-200 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* 퀵 메뉴 */}
        <section className="grid sm:grid-cols-3 gap-4 mb-14">
          {QUICK_MENUS.map(({ href, icon: Icon, label, desc, color, border }) => (
            <Link key={href} href={href}>
              <Card className={`hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full border ${border}`}>
                <div className={`inline-flex rounded-xl p-3 mb-3 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">{label}</p>
                <p className="text-sm text-gray-500">{desc}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-400">
                  바로가기 <ArrowRight className="h-3 w-3" />
                </div>
              </Card>
            </Link>
          ))}
        </section>

        {/* 주목할 해커톤 */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">주목할 해커톤</h2>
              <p className="text-sm text-gray-500 mt-0.5">지금 참가 가능한 해커톤</p>
            </div>
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
                  <Card padding="none" className="overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full flex flex-col">
                    <div className="relative h-36 bg-gradient-to-br from-violet-100 to-blue-100">
                      {h.thumbnailUrl ? (
                        <Image src={h.thumbnailUrl} alt={h.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Zap className="h-10 w-10 text-violet-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute bottom-2 left-3">
                        <Badge variant="status" status={h.status} />
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 flex-1">{h.title}</h3>
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

        {/* 기능 소개 */}
        <section className="rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Sync-Up으로 할 수 있는 것들</h2>
          <p className="text-sm text-gray-500 text-center mb-8">해커톤 참가부터 커리어 관리까지 한 곳에서</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="text-center">
                <div className="inline-flex rounded-2xl bg-white shadow-sm p-4 mb-3 border border-violet-100">
                  <Icon className="h-6 w-6 text-violet-600" />
                </div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
