'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTeamStore } from '@/store/teamStore';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const init = useAuthStore((s) => s.init);
  const refreshTeams = useTeamStore((s) => s.refreshTeams);

  useEffect(() => {
    init();
    refreshTeams();
  }, [init, refreshTeams]);

  return <>{children}</>;
}
