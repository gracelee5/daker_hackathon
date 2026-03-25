// ─── 공개 데이터 타입 (/data 폴더 기반) ─────────────────────────────────────

export type HackathonStatus = 'ongoing' | 'upcoming' | 'ended';

export interface HackathonPeriod {
  timezone: string;
  submissionDeadlineAt: string;
  endAt: string;
}

export interface HackathonLinks {
  detail: string;
  rules: string;
  faq: string;
}

export interface Hackathon {
  slug: string;
  title: string;
  status: HackathonStatus;
  tags: string[];
  thumbnailUrl: string;
  period: HackathonPeriod;
  links: HackathonLinks;
}

// 상세 섹션
export interface TeamPolicy {
  allowSolo: boolean;
  maxTeamSize: number;
}

export interface ScoreBreakdownItem {
  key: string;
  label: string;
  weightPercent: number;
}

export interface EvalSection {
  metricName: string;
  description: string;
  limits?: { maxRuntimeSec: number; maxSubmissionsPerDay: number };
  scoreSource?: string;
  scoreDisplay?: {
    label: string;
    breakdown: ScoreBreakdownItem[];
  };
}

export interface Milestone {
  name: string;
  at: string;
}

export interface PrizeItem {
  place: string;
  amountKRW: number;
}

export type ArtifactType = 'zip' | 'url' | 'pdf' | 'text';

export interface SubmissionItem {
  key: string;
  title: string;
  format: string;
}

export interface HackathonDetailSections {
  overview: {
    summary: string;
    teamPolicy: TeamPolicy;
  };
  info: {
    notice: string[];
    links: { rules: string; faq: string };
  };
  eval: EvalSection;
  schedule: {
    timezone: string;
    milestones: Milestone[];
  };
  prize?: {
    items: PrizeItem[];
  };
  teams: {
    campEnabled: boolean;
    listUrl: string;
  };
  submit: {
    allowedArtifactTypes: ArtifactType[];
    submissionUrl: string;
    guide: string[];
    submissionItems?: SubmissionItem[];
  };
  leaderboard: {
    publicLeaderboardUrl: string;
    note: string;
  };
}

export interface HackathonDetail {
  slug: string;
  title: string;
  sections: HackathonDetailSections;
}

// 팀
export interface Team {
  teamCode: string;
  hackathonSlug: string;
  name: string;
  isOpen: boolean;
  memberCount: number;
  maxMembers: number;
  lookingFor: string[];
  intro: string;
  contact: {
    type: string;
    url: string;
  };
  createdAt: string;
  leaderId?: string;
}

// 리더보드
export interface LeaderboardArtifacts {
  webUrl?: string;
  pdfUrl?: string;
  planTitle?: string;
}

export interface LeaderboardEntry {
  rank: number;
  teamName: string;
  score: number;
  submittedAt: string;
  scoreBreakdown?: {
    participant: number;
    judge: number;
  };
  artifacts?: LeaderboardArtifacts;
}

export interface Leaderboard {
  hackathonSlug: string;
  updatedAt: string;
  entries: LeaderboardEntry[];
}

// ─── localStorage 스키마 타입 ────────────────────────────────────────────────

export type Position = 'Frontend' | 'Backend' | 'Designer' | 'PM' | 'ML Engineer' | 'DevOps' | string;

export interface UserProfile {
  id: string;
  nickname: string;
  bio: string;
  avatarUrl?: string;
  positions: Position[];
  techStack: string[];
  totalPoints: number;
  createdAt: string;
}

export interface TeamJoinRequest {
  id: string;
  teamCode: string;
  hackathonSlug: string;
  fromUserId: string;
  fromUserNickname: string;
  fromUserBio: string;
  fromUserPositions: string[];
  toUserId?: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: string;
}

export interface UserTeamMembership {
  teamCode: string;
  hackathonSlug: string;
  role: Position;
  joinedAt: string;
}

export interface Submission {
  id: string;
  hackathonSlug: string;
  teamCode: string;
  submittedAt: string;
  artifacts: {
    plan?: string;
    webUrl?: string;
    pdfUrl?: string;
    zipUrl?: string;
  };
}

export interface ActivityCertificate {
  id: string;
  userId: string;
  hackathonSlug: string;
  hackathonTitle: string;
  teamName: string;
  role: Position;
  rank?: number;
  totalTeams?: number;
  score?: number;
  artifacts?: LeaderboardArtifacts;
  issuedAt: string;
}

export interface HackathonParticipation {
  userId?: string;
  hackathonSlug: string;
  hackathonTitle: string;
  teamCode: string;
  teamName: string;
  role: Position;
  status: HackathonStatus;
  submitted?: boolean;
  submittedAt?: string;
  result?: {
    rank: number;
    score: number;
    totalTeams: number;
  };
  joinedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'join_request' | 'request_accepted' | 'request_rejected' | 'hackathon_registered' | 'submission_complete' | 'team_chat';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: {
    teamCode?: string;
    teamName?: string;
    requestId?: string;
    hackathonSlug?: string;
    hackathonTitle?: string;
  };
}

export interface ChatMessage {
  id: string;
  teamCode: string;
  userId: string;
  userNickname: string;
  content: string;
  createdAt: string;
}

export interface TeamMember {
  teamCode: string;
  userId: string;
  nickname: string;
  role: Position;
  joinedAt: string;
  isLeader: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  password: string;
  nickname: string;
  bio: string;
  positions: Position[];
  techStack: string[];
  totalPoints: number;
  createdAt: string;
}

// localStorage 전체 스키마
export interface LocalStorageSchema {
  'syncup:currentUser': UserProfile | null;
  'syncup:users': AuthUser[];
  'syncup:teams': Team[];
  'syncup:joinRequests': TeamJoinRequest[];
  'syncup:submissions': Submission[];
  'syncup:certificates': ActivityCertificate[];
  'syncup:participations': HackathonParticipation[];
  'syncup:notifications': Notification[];
  'syncup:teamMembers': TeamMember[];
  'syncup:chats': ChatMessage[];
}
