import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 mt-16">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2 font-semibold text-violet-600">
          <Zap className="h-4 w-4" />
          Sync-Up
        </div>
        <p className="text-center">
          해커톤, 단순한 참여를 넘어 당신의 성장이 기록되는 곳
        </p>
        <p>© 2026 Sync-Up</p>
      </div>
    </footer>
  );
}
