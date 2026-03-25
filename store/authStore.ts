import { create } from 'zustand';
import { storage } from '@/lib/storage';
import type { UserProfile, Notification, AuthUser, TeamMember } from '@/types';

function ensureTestAccount() {
  if (typeof window === 'undefined') return;
  const existing = storage.findUserByEmail('test@syncup.com');
  if (!existing) {
    const testUser: AuthUser = {
      id: 'user-test-001',
      email: 'test@syncup.com',
      password: 'password1234',
      nickname: '테스터',
      bio: '심사용 테스트 계정입니다.',
      positions: ['Frontend', 'PM'],
      techStack: ['Frontend', 'PM'],
      totalPoints: 1200,
      createdAt: '2026-01-01T00:00:00+09:00',
    };
    storage.registerUser(testUser);
    // 테스트 계정을 팀장으로 T-HANDOVER-01에 추가
    storage.addTeamMember({
      teamCode: 'T-HANDOVER-01',
      userId: 'user-test-001',
      nickname: '테스터',
      role: 'Frontend',
      joinedAt: '2026-03-04T11:00:00+09:00',
      isLeader: true,
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
