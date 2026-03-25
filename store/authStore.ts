import { create } from 'zustand';
import { storage } from '@/lib/storage';
import type { UserProfile, Notification, AuthUser, TeamMember, HackathonParticipation, Submission } from '@/types';

const DEMO_USERS: AuthUser[] = [
  { id: 'user-demo-1', email: 'demo1@syncup.com', password: 'demo1234', nickname: 'LightSpeed', bio: 'ML 모델 최적화 전문가입니다.', positions: ['Backend', 'ML Engineer'], techStack: ['Python', 'PyTorch'], totalPoints: 2400, createdAt: '2026-01-15T09:00:00+09:00' },
  { id: 'user-demo-2', email: 'demo2@syncup.com', password: 'demo1234', nickname: 'PromptHero', bio: '프롬프트 엔지니어링에 푹 빠진 개발자.', positions: ['Frontend', 'PM'], techStack: ['React', 'TypeScript'], totalPoints: 1800, createdAt: '2026-01-20T10:00:00+09:00' },
  { id: 'user-demo-3', email: 'demo3@syncup.com', password: 'demo1234', nickname: 'DevArchitect', bio: '빠르게 프로토타입 만들기를 좋아합니다.', positions: ['Backend', 'DevOps'], techStack: ['Node.js', 'Docker'], totalPoints: 3100, createdAt: '2026-02-01T11:00:00+09:00' },
  { id: 'user-demo-4', email: 'demo4@syncup.com', password: 'demo1234', nickname: 'CleanCoder', bio: '클린 코드와 문서화를 중시합니다.', positions: ['Backend', 'Frontend'], techStack: ['Go', 'Vue.js'], totalPoints: 2700, createdAt: '2026-02-05T09:30:00+09:00' },
  { id: 'user-demo-5', email: 'demo5@syncup.com', password: 'demo1234', nickname: 'ContextMaster', bio: 'AI 도구 워크플로우 최적화 관심.', positions: ['PM', 'Frontend'], techStack: ['Figma', 'React'], totalPoints: 1500, createdAt: '2026-02-10T14:00:00+09:00' },
  { id: 'user-demo-6', email: 'demo6@syncup.com', password: 'demo1234', nickname: 'PixelCraft', bio: 'AI와 디자인의 경계를 탐구합니다.', positions: ['Designer', 'Frontend'], techStack: ['Figma', 'Framer'], totalPoints: 2100, createdAt: '2026-02-15T10:00:00+09:00' },
  { id: 'user-demo-7', email: 'demo7@syncup.com', password: 'demo1234', nickname: 'NoCodeNinja', bio: '노코드로 세상을 바꾸는 중.', positions: ['PM', 'Designer'], techStack: ['Webflow', 'Notion'], totalPoints: 900, createdAt: '2026-02-20T09:00:00+09:00' },
  { id: 'user-demo-8', email: 'demo8@syncup.com', password: 'demo1234', nickname: 'DataViz', bio: '데이터 시각화로 인사이트를 전달합니다.', positions: ['Backend', 'ML Engineer'], techStack: ['Python', 'D3.js'], totalPoints: 2200, createdAt: '2026-03-01T10:00:00+09:00' },
  { id: 'user-demo-9', email: 'demo9@syncup.com', password: 'demo1234', nickname: 'A11yChamp', bio: '접근성이 좋은 UI를 만드는 것이 목표.', positions: ['Frontend', 'Designer'], techStack: ['React Native', 'Tailwind'], totalPoints: 1600, createdAt: '2026-03-10T11:00:00+09:00' },
];

const DEMO_MEMBERS: TeamMember[] = [
  { teamCode: 'T-ALPHA', userId: 'user-demo-1', nickname: 'LightSpeed', role: 'Backend', joinedAt: '2026-02-20T11:00:00+09:00', isLeader: true },
  { teamCode: 'T-BETA', userId: 'user-demo-2', nickname: 'PromptHero', role: 'PM', joinedAt: '2026-02-18T18:30:00+09:00', isLeader: true },
  { teamCode: 'T-HANDOVER-01', userId: 'user-demo-3', nickname: 'DevArchitect', role: 'Backend', joinedAt: '2026-03-04T11:00:00+09:00', isLeader: true },
  { teamCode: 'T-HANDOVER-01', userId: 'user-demo-6', nickname: 'PixelCraft', role: 'Designer', joinedAt: '2026-03-04T12:00:00+09:00', isLeader: false },
  { teamCode: 'T-HANDOVER-01', userId: 'user-demo-7', nickname: 'NoCodeNinja', role: 'PM', joinedAt: '2026-03-04T13:00:00+09:00', isLeader: false },
  { teamCode: 'T-HANDOVER-02', userId: 'user-demo-4', nickname: 'CleanCoder', role: 'Backend', joinedAt: '2026-03-05T09:20:00+09:00', isLeader: true },
  { teamCode: 'T-VIBE-01', userId: 'user-demo-5', nickname: 'ContextMaster', role: 'Frontend', joinedAt: '2026-02-19T14:00:00+09:00', isLeader: true },
  { teamCode: 'T-DESIGN-01', userId: 'user-demo-6', nickname: 'PixelCraft', role: 'Designer', joinedAt: '2026-03-15T10:00:00+09:00', isLeader: true },
  { teamCode: 'T-DESIGN-02', userId: 'user-demo-7', nickname: 'NoCodeNinja', role: 'PM', joinedAt: '2026-03-16T09:00:00+09:00', isLeader: true },
  { teamCode: 'T-DATA-01', userId: 'user-demo-8', nickname: 'DataViz', role: 'Backend', joinedAt: '2026-03-20T11:00:00+09:00', isLeader: true },
  { teamCode: 'T-MOBILE-01', userId: 'user-demo-9', nickname: 'A11yChamp', role: 'Frontend', joinedAt: '2026-03-25T10:00:00+09:00', isLeader: true },
  // 신규 진행 중 해커톤 멤버
  { teamCode: 'T-GENAI-01', userId: 'user-demo-1', nickname: 'LightSpeed', role: 'Backend', joinedAt: '2026-03-26T09:00:00+09:00', isLeader: true },
  { teamCode: 'T-GENAI-01', userId: 'user-demo-2', nickname: 'PromptHero', role: 'Frontend', joinedAt: '2026-03-26T10:00:00+09:00', isLeader: false },
  { teamCode: 'T-GENAI-01', userId: 'user-demo-9', nickname: 'A11yChamp', role: 'Frontend', joinedAt: '2026-03-26T11:00:00+09:00', isLeader: false },
  { teamCode: 'T-GENAI-02', userId: 'user-demo-5', nickname: 'ContextMaster', role: 'PM', joinedAt: '2026-03-26T11:00:00+09:00', isLeader: true },
  { teamCode: 'T-GENAI-02', userId: 'user-demo-6', nickname: 'PixelCraft', role: 'Designer', joinedAt: '2026-03-26T12:00:00+09:00', isLeader: false },
  { teamCode: 'T-FULLSTACK-01', userId: 'user-demo-3', nickname: 'DevArchitect', role: 'Backend', joinedAt: '2026-03-27T10:00:00+09:00', isLeader: true },
  { teamCode: 'T-FULLSTACK-01', userId: 'user-demo-4', nickname: 'CleanCoder', role: 'Backend', joinedAt: '2026-03-27T11:00:00+09:00', isLeader: false },
  { teamCode: 'T-FULLSTACK-01', userId: 'user-demo-7', nickname: 'NoCodeNinja', role: 'PM', joinedAt: '2026-03-27T12:00:00+09:00', isLeader: false },
  { teamCode: 'T-ML-01', userId: 'user-demo-8', nickname: 'DataViz', role: 'ML Engineer', joinedAt: '2026-03-21T11:00:00+09:00', isLeader: true },
  { teamCode: 'T-ML-01', userId: 'user-demo-1', nickname: 'LightSpeed', role: 'ML Engineer', joinedAt: '2026-03-21T12:00:00+09:00', isLeader: false },
  { teamCode: 'T-ML-02', userId: 'user-demo-4', nickname: 'CleanCoder', role: 'Backend', joinedAt: '2026-03-22T09:00:00+09:00', isLeader: true },
  { teamCode: 'T-ML-02', userId: 'user-demo-9', nickname: 'A11yChamp', role: 'Frontend', joinedAt: '2026-03-22T10:00:00+09:00', isLeader: false },
];

const DEMO_PARTICIPATIONS: HackathonParticipation[] = [
  {
    hackathonSlug: 'genai-startup-sprint-2026-03',
    hackathonTitle: 'GenAI 스타트업 스프린트: 아이디어를 제품으로',
    teamCode: 'T-GENAI-01',
    teamName: 'StartupSpark',
    role: 'Backend',
    status: 'ongoing',
    submitted: false,
    joinedAt: '2026-03-26T09:00:00+09:00',
  },
  {
    hackathonSlug: 'genai-startup-sprint-2026-03',
    hackathonTitle: 'GenAI 스타트업 스프린트: 아이디어를 제품으로',
    teamCode: 'T-GENAI-02',
    teamName: 'IdeaForge',
    role: 'PM',
    status: 'ongoing',
    submitted: false,
    joinedAt: '2026-03-26T11:00:00+09:00',
  },
  {
    hackathonSlug: 'fullstack-challenge-2026-03',
    hackathonTitle: '풀스택 마라톤: 72시간 서비스 배포 챌린지',
    teamCode: 'T-FULLSTACK-01',
    teamName: 'StackOverflow',
    role: 'Backend',
    status: 'ongoing',
    submitted: false,
    joinedAt: '2026-03-27T10:00:00+09:00',
  },
  {
    hackathonSlug: 'data-ml-hackathon-2026-03',
    hackathonTitle: '데이터·ML 해커톤: 실전 예측 모델 챌린지',
    teamCode: 'T-ML-01',
    teamName: 'GradientBoost',
    role: 'ML Engineer',
    status: 'ongoing',
    submitted: true,
    submittedAt: '2026-03-24T20:15:00+09:00',
    joinedAt: '2026-03-21T11:00:00+09:00',
  },
  {
    hackathonSlug: 'data-ml-hackathon-2026-03',
    hackathonTitle: '데이터·ML 해커톤: 실전 예측 모델 챌린지',
    teamCode: 'T-ML-02',
    teamName: 'NeuralNomads',
    role: 'Backend',
    status: 'ongoing',
    submitted: false,
    joinedAt: '2026-03-22T09:00:00+09:00',
  },
];

const DEMO_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-ml-01',
    hackathonSlug: 'data-ml-hackathon-2026-03',
    teamCode: 'T-ML-01',
    submittedAt: '2026-03-24T20:15:00+09:00',
    artifacts: {
      webUrl: 'https://github.com/example/gradient-boost',
      pdfUrl: 'https://example.com/gradient-boost-solution.pdf',
    },
  },
];

function seedDemoData() {
  if (typeof window === 'undefined') return;
  const seeded = localStorage.getItem('syncup:demo_seeded_v2');
  if (seeded) return;

  // 데모 유저 등록
  DEMO_USERS.forEach((u) => {
    if (!storage.findUserByEmail(u.email)) storage.registerUser(u);
  });

  // 데모 팀 멤버 추가
  DEMO_MEMBERS.forEach((m) => storage.addTeamMember(m));

  localStorage.setItem('syncup:demo_seeded_v2', 'true');
}

function seedDemoDataV3() {
  if (typeof window === 'undefined') return;
  const seeded = localStorage.getItem('syncup:demo_seeded_v3');
  if (seeded) return;

  // 신규 팀 멤버 추가 (idempotent)
  DEMO_MEMBERS.forEach((m) => storage.addTeamMember(m));

  // 참여 이력 추가
  DEMO_PARTICIPATIONS.forEach((p) => storage.saveParticipation(p));

  // 제출 데이터 추가
  DEMO_SUBMISSIONS.forEach((s) => storage.saveSubmission(s));

  localStorage.setItem('syncup:demo_seeded_v3', 'true');
}

function ensureTestAccount() {
  if (typeof window === 'undefined') return;
  seedDemoData();
  seedDemoDataV3();
  const existing = storage.findUserByEmail('test@syncup.com');
  if (!existing) {
    const testUser: AuthUser = {
      id: 'user-test-001',
      email: 'test@syncup.com',
      password: 'password1234',
      nickname: '테스터',
      bio: '테스트 계정입니다.',
      positions: ['Frontend', 'PM'],
      techStack: ['Frontend', 'PM'],
      totalPoints: 1200,
      createdAt: '2026-01-01T00:00:00+09:00',
    };
    storage.registerUser(testUser);
    storage.addTeamMember({
      teamCode: 'T-HANDOVER-01',
      userId: 'user-test-001',
      nickname: '테스터',
      role: 'Frontend',
      joinedAt: '2026-03-04T11:00:00+09:00',
      isLeader: false,
    });
  }
}

interface AuthState {
  user: UserProfile | null;
  ready: boolean;
  notifications: Notification[];
  unreadCount: number;

  // actions
  init: () => void;
  login: (user: UserProfile) => void;
  logout: () => void;
  refreshNotifications: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  ready: false,
  notifications: [],
  unreadCount: 0,

  init: () => {
    ensureTestAccount();
    const user = storage.getCurrentUser();
    const notifications = user ? storage.getNotifications(user.id) : [];
    set({
      user,
      ready: true,
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    });
  },

  login: (user: UserProfile) => {
    storage.setCurrentUser(user);
    const notifications = storage.getNotifications(user.id);
    set({
      user,
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    });
  },

  logout: () => {
    storage.logout();
    set({ user: null, notifications: [], unreadCount: 0 });
  },

  refreshNotifications: () => {
    const { user } = get();
    if (!user) return;
    const notifications = storage.getNotifications(user.id);
    set({ notifications, unreadCount: notifications.filter((n) => !n.read).length });
  },

  addNotification: (n) => {
    storage.addNotification(n);
    get().refreshNotifications();
  },

  markNotificationRead: (id: string) => {
    storage.markNotificationRead(id);
    get().refreshNotifications();
  },

  markAllNotificationsRead: () => {
    const { user } = get();
    if (!user) return;
    storage.markAllNotificationsRead(user.id);
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  updateUser: (updates: Partial<UserProfile>) => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, ...updates };
    storage.setCurrentUser(updated);
    // AuthUser도 업데이트
    const users = storage.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = {
        ...users[idx],
        nickname: updated.nickname,
        bio: updated.bio,
        positions: updated.positions,
        techStack: updated.techStack,
      };
      // storage.registerUser 대신 직접 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('syncup:users', JSON.stringify(users));
      }
    }
    set({ user: updated });
  },
}));
