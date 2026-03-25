import { create } from 'zustand';
import { storage } from '@/lib/storage';
import type { Team } from '@/types';

interface TeamState {
  localTeams: Team[];
  addTeam: (team: Team) => void;
  updateTeam: (team: Team) => void;
  refreshTeams: () => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  localTeams: [],

  addTeam: (team: Team) => {
    storage.saveTeam(team);
    set((state) => ({ localTeams: [team, ...state.localTeams] }));
  },

  updateTeam: (team: Team) => {
    storage.saveTeam(team);
    set((state) => ({
      localTeams: state.localTeams.map((t) => (t.teamCode === team.teamCode ? team : t)),
    }));
  },

  refreshTeams: () => {
    set({ localTeams: storage.getTeams() });
  },
}));
