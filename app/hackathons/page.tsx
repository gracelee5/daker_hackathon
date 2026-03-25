'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Search } from 'lucide-react';
import { getHackathons } from '@/lib/data';
import { HackathonStatus } from '@/types';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import { EmptyState } from '@/components/common/StatusUI';

const STATUS_FILTERS: { value: HackathonStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'ongoing', label: '진행 중' },
  { value: 'upcoming', label: '예정' },
  { value: 'ended', label: '종료' },
];

export default function HackathonsPage() {
  const allHackathons = getHackathons();
  const allTags = useMemo(
    () => Array.from(new Set(allHackathons.flatMap((h) => h.tags))),
    [allHackathons]
  );

  const [status, setStatus] = useState<HackathonStatus | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return allHackathons.filter((h) => {
      if (status !== 'all' && h.status !== status) return false;
      if (selectedTags.length > 0 && !selectedTags.every((t) => h.tags.includes(t))) return false;
      if (query && !h.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [allHackathons, status, selectedTags, query]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">해커톤</h1>

      {/* 검색 */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="해커톤 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />
      </div>

      {/* 상태 필터 */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatus(value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              status === value
                ? 'bg-violet-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 태그 필터 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedTags.includes(tag)
                ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 목록 */}
      {filtered.length === 0 ? (
        <EmptyState
          title="조건에 맞는 해커톤이 없습니다"
          description="필터를 변경하거나 검색어를 다시 입력해 보세요."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((h) => (
            <Link key={h.slug} href={`/hackathons/${h.slug}`}>
              <Card padding="none" className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                <div className="relative h-36 bg-gradient-to-br from-violet-100 to-blue-100">
                  {h.thumbnailUrl ? (
                    <Image src={h.thumbnailUrl} alt={h.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Zap className="h-10 w-10 text-violet-300" />
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="status" status={h.status} />
                  </div>
                  <h2 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-3 flex-1">{h.title}</h2>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {h.tags.map((tag) => (
                      <Badge key={tag} variant="tag">{tag}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    마감 {new Date(h.period.submissionDeadlineAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
