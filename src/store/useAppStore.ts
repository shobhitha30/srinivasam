import { create } from 'zustand';
import type { UserRole } from '../types';

interface AppState {
  activeRole: UserRole;
  activeShelterIndex: number;
  sidebarOpen: boolean;
  setRole: (role: UserRole) => void;
  setActiveShelterIndex: (idx: number) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeRole: 'public',
  activeShelterIndex: 0,
  sidebarOpen: true,
  setRole: (role) => set({ activeRole: role }),
  setActiveShelterIndex: (idx) => set({ activeShelterIndex: idx }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
