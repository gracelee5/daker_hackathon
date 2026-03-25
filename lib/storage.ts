import type {
  LocalStorageSchema,
  Team,
  TeamJoinRequest,
  Submission,
  ActivityCertificate,
  HackathonParticipation,
  UserProfile,
  AuthUser,
  Notification,
  TeamMember,
  ChatMessage,
} from '@/types';

type StorageKey = keyof LocalStorageSchema;

function getItem<K extends StorageKey>(key: K): LocalStorageSchema[K] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as LocalStorageSchema[K]) : null;
  } catch {
    return null;
  }
}

function setItem<K extends StorageKey>(key: K, value: LocalStorageSchema[K]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  // ─── 유저 세션 ────────────────────────────────────────────────────────────
  getCurrentUser: (): UserProfile | null =>
    getItem('syncup:currentUser'),

  setCurrentUser: (user: UserProfile | null): void =>
    setItem('syncup:currentUser', user),

  logout: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('syncup:currentUser');
  },

  // ─── 회원 관리 ────────────────────────────────────────────────────────────
  getUsers: (): AuthUser[] =>
    getItem('syncup:users') ?? [],

  findUserByEmail: (email: string): AuthUser | undefined =>
    storage.getUsers().find((u) => u.email === email),

  registerUser: (user: AuthUser): void => {
    const users = storage.getUsers();
    users.push(user);
    setItem('syncup:users', users);
  },

  updateUserPoints: (userId: string, points: number): void => {
    const users = storage.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx >= 0) {
      users[idx].totalPoints += points;
      setItem('syncup:users', users);
      const current = storage.getCurrentUser();
      if (current?.id === userId) {
        setItem('syncup:currentUser', { ...current, totalPoints: current.totalPoints + points });
      }
    }
  },

  // ─── 팀 ──────────────────────────────────────────────────────────────────
  getTeams: (): Team[] =>
    getItem('syncup:teams') ?? [],

  saveTeam: (team: Team): void => {
    const teams = storage.getTeams();
    const idx = teams.findIndex((t) => t.teamCode === team.teamCode);
    if (idx >= 0) teams[idx] = team;
    else teams.push(team);
    setItem('syncup:teams', teams);
  },

  closeTeam: (teamCode: string): void => {
    const teams = storage.getTeams();
    const idx = teams.findIndex((t) => t.teamCode === teamCode);
    if (idx >= 0) {
      teams[idx].isOpen = false;
      setItem('syncup:teams', teams);
    }
  },

  // ─── 합류 요청 ────────────────────────────────────────────────────────────
  getJoinRequests: (): TeamJoinRequest[] =>
    getItem('syncup:joinRequests') ?? [],

  getJoinRequestsForTeam: (teamCode: string): TeamJoinRequest[] =>
    storage.getJoinRequests().filter((r) => r.teamCode === teamCode),

  saveJoinRequest: (req: TeamJoinRequest): void => {
    const reqs = storage.getJoinRequests();
    const idx = reqs.findIndex((r) => r.id === req.id);
    if (idx >= 0) reqs[idx] = req;
    else reqs.push(req);
    setItem('syncup:joinRequests', reqs);
  },

  updateJoinRequestStatus: (id: string, status: 'accepted' | 'rejected'): TeamJoinRequest | null => {
    const reqs = storage.getJoinRequests();
    const idx = reqs.findIndex((r) => r.id === id);
    if (idx < 0) return null;
    reqs[idx].status = status;
    setItem('syncup:joinRequests', reqs);

    // 수락 시 팀 멤버 수 증가 + 정원 초과 시 마감
    if (status === 'accepted') {
      const req = reqs[idx];
      const teams = storage.getTeams();
      const tIdx = teams.findIndex((t) => t.teamCode === req.teamCode);
      if (tIdx >= 0) {
        teams[tIdx].memberCount += 1;
        if (teams[tIdx].memberCount >= teams[tIdx].maxMembers) {
          teams[tIdx].isOpen = false;
        }
        setItem('syncup:teams', teams);
      }
    }
    return reqs[idx];
  },

  // ─── 알림 ─────────────────────────────────────────────────────────────────
  getNotifications: (userId: string): Notification[] =>
    (getItem('syncup:notifications') ?? []).filter((n) => n.userId === userId),

  getAllNotifications: (): Notification[] =>
    getItem('syncup:notifications') ?? [],

  addNotification: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>): void => {
    const all = storage.getAllNotifications();
    all.unshift({
      ...n,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
    setItem('syncup:notifications', all);
  },

  markNotificationRead: (id: string): void => {
    const all = storage.getAllNotifications();
    const idx = all.findIndex((n) => n.id === id);
    if (idx >= 0) {
      all[idx].read = true;
      setItem('syncup:notifications', all);
    }
  },

  markAllNotificationsRead: (userId: string): void => {
    const all = storage.getAllNotifications().map((n) =>
      n.userId === userId ? { ...n, read: true } : n
    );
    setItem('syncup:notifications', all);
  },

  // ─── 제출물 ───────────────────────────────────────────────────────────────
  getSubmissions: (): Submission[] =>
    getItem('syncup:submissions') ?? [],

  saveSubmission: (sub: Submission): void => {
    const subs = storage.getSubmissions();
    const idx = subs.findIndex((s) => s.id === sub.id);
    if (idx >= 0) subs[idx] = sub;
    else subs.push(sub);
    setItem('syncup:submissions', subs);
  },

  // ─── 경험 증명서 ──────────────────────────────────────────────────────────
  getCertificates: (): ActivityCertificate[] =>
    getItem('syncup:certificates') ?? [],

  saveCertificate: (cert: ActivityCertificate): void => {
    const certs = storage.getCertificates();
    const idx = certs.findIndex((c) => c.id === cert.id);
    if (idx >= 0) certs[idx] = cert;
    else certs.push(cert);
    setItem('syncup:certificates', certs);
  },

  // ─── 참여 이력 ────────────────────────────────────────────────────────────
  getParticipations: (): HackathonParticipation[] =>
    getItem('syncup:participations') ?? [],

  saveParticipation: (p: HackathonParticipation): void => {
    const list = storage.getParticipations();
    const idx = list.findIndex(
      (item) => item.hackathonSlug === p.hackathonSlug && item.teamCode === p.teamCode
    );
    if (idx >= 0) list[idx] = p;
    else list.push(p);
    setItem('syncup:participations', list);
  },

  markParticipationSubmitted: (hackathonSlug: string): void => {
    const list = storage.getParticipations();
    const idx = list.findIndex((p) => p.hackathonSlug === hackathonSlug);
    if (idx >= 0) {
      list[idx].submitted = true;
      list[idx].submittedAt = new Date().toISOString();
      setItem('syncup:participations', list);
    }
  },

  // ─── 팀 멤버 ──────────────────────────────────────────────────────────────
  getTeamMembers: (teamCode?: string): TeamMember[] => {
    const all = getItem('syncup:teamMembers') ?? [];
    return teamCode ? all.filter((m) => m.teamCode === teamCode) : all;
  },

  addTeamMember: (member: TeamMember): void => {
    const all = getItem('syncup:teamMembers') ?? [];
    const exists = all.some((m) => m.teamCode === member.teamCode && m.userId === member.userId);
    if (!exists) {
      all.push(member);
      setItem('syncup:teamMembers', all);
    }
  },

  updateTeamMemberRole: (teamCode: string, userId: string, role: string): void => {
    const all = getItem('syncup:teamMembers') ?? [];
    const idx = all.findIndex((m) => m.teamCode === teamCode && m.userId === userId);
    if (idx >= 0) {
      all[idx].role = role;
      setItem('syncup:teamMembers', all);
    }
  },

  removeTeamMember: (teamCode: string, userId: string): void => {
    const all = (getItem('syncup:teamMembers') ?? []).filter(
      (m) => !(m.teamCode === teamCode && m.userId === userId)
    );
    setItem('syncup:teamMembers', all);
  },

  // ─── 채팅 ─────────────────────────────────────────────────────────────────
  getChats: (teamCode: string): ChatMessage[] =>
    (getItem('syncup:chats') ?? []).filter((c) => c.teamCode === teamCode),

  addChat: (msg: ChatMessage): void => {
    const all = getItem('syncup:chats') ?? [];
    all.push(msg);
    setItem('syncup:chats', all);
  },
};
