import Link from 'next/link';
import { Zap, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      {/* 일러스트 */}
      <div className="relative mb-8 select-none">
        <div className="text-[120px] leading-none font-black text-gray-100 tracking-tighter">404</div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          {/* 캐릭터: 화면 보는 해커 */}
          <div className="text-6xl animate-bounce">🤖</div>
          <div className="flex gap-1 text-2xl">
            <span className="animate-pulse">💻</span>
            <span className="text-lg mt-1">?</span>
          </div>
        </div>
      </div>

      {/* 메시지 */}
      <div className="mb-2 flex items-center gap-2 justify-center">
        <Zap className="h-5 w-5 text-violet-500" />
        <span className="text-sm font-semibold text-violet-600 uppercase tracking-wide">Sync-Up</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        이 페이지는 인수인계가 안 됐어요
      </h1>
      <p className="text-gray-500 max-w-sm mb-2">
        명세서에 없는 페이지입니다. 링크가 잘못됐거나, 이미 삭제된 페이지예요.
      </p>
      <p className="text-sm text-gray-400 mb-8">
        해커톤처럼 당황하지 말고, 다시 탐색해 보세요 👇
      </p>

      {/* 액션 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
        >
          <Home className="h-4 w-4" />
          홈으로
        </Link>
        <Link
          href="/hackathons"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Search className="h-4 w-4" />
          해커톤 탐색
        </Link>
      </div>
    </div>
  );
}
