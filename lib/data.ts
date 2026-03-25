import type { Hackathon, HackathonDetail, Team, Leaderboard } from '@/types';

import hackathonsJson from '@/data/public_hackathons.json';
import hackathonDetailJson from '@/data/public_hackathon_detail.json';
import teamsJson from '@/data/public_teams.json';
import leaderboardJson from '@/data/public_leaderboard.json';

// ─── 해커톤 목록 ──────────────────────────────────────────────────────────────
export function getHackathons(): Hackathon[] {
  return hackathonsJson as Hackathon[];
}

export function getHackathonBySlug(slug: string): Hackathon | undefined {
  return getHackathons().find((h) => h.slug === slug);
}

// ─── 해커톤 상세 ──────────────────────────────────────────────────────────────
function getAllDetails(): HackathonDetail[] {
  const { slug, title, sections, extraDetails } = hackathonDetailJson as {
    slug: string;
    title: string;
    sections: HackathonDetail['sections'];
    extraDetails: HackathonDetail[];
  };
  return [{ slug, title, sections }, ...extraDetails];
}

export function getHackathonDetail(slug: string): HackathonDetail | undefined {
  return getAllDetails().find((d) => d.slug === slug);
}

// ─── 팀 목록 ─────────────────────────────────────────────────────────────────
export function getPublicTeams(hackathonSlug?: string): Team[] {
  const teams = teamsJson as Team[];
  if (!hackathonSlug) return teams;
  return teams.filter((t) => t.hackathonSlug === hackathonSlug);
}

// ─── 리더보드 ─────────────────────────────────────────────────────────────────
function getAllLeaderboards(): Leaderboard[] {
  const { hackathonSlug, updatedAt, entries, extraLeaderboards } = leaderboardJson as {
    hackathonSlug: string;
    updatedAt: string;
    entries: Leaderboard['entries'];
    extraLeaderboards: Leaderboard[];
  };
  return [{ hackathonSlug, updatedAt, entries }, ...extraLeaderboards];
}

export function getLeaderboard(hackathonSlug: string): Leaderboard | undefined {
  return getAllLeaderboards().find((l) => l.hackathonSlug === hackathonSlug);
}

export function getAllLeaderboardEntries() {
  return getAllLeaderboards();
}
