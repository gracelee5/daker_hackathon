import type {
  LocalStorageSchema,
  Team,
  TeamJoinRequest,
  Submission,
  ActivityCertificate,
  HackathonParticipation,
  UserProfile,
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

// ─── 유저 ──────────────────────────────────────────────────────────────────
export const storage = {
  getCurrentUser: (): UserProfile | null =>
    getItem('syncup:currentUser'),

  setCurrentUser: (user: UserProfile | null): void =>
    setItem('syncup:currentUser', user),

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

  // ─── 합류 요청 ────────────────────────────────────────────────────────────
  getJoinRequests: (): TeamJoinRequest[] =>
    getItem('syncup:joinRequests') ?? [],

  saveJoinRequest: (req: TeamJoinRequest): void => {
    const reqs = storage.getJoinRequests();
    const idx = reqs.findIndex((r) => r.id === req.id);
    if (idx >= 0) reqs[idx] = req;
    else reqs.push(req);
    setItem('syncup:joinRequests', reqs);
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
};
