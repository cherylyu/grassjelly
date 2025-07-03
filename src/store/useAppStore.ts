import { create } from 'zustand';

interface AppState {
  currentView: 'filter' | 'about';
  sidebarCollapsed: boolean;
  selectedCategory: string | null;
  setCurrentView: (view: 'filter' | 'about') => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'filter',
  sidebarCollapsed: false,
  selectedCategory: 'all',
  setCurrentView: (view) => set({ currentView: view }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSelectedCategory: (categoryId) => set((state) => ({ selectedCategory: state.selectedCategory === categoryId ? null : categoryId })),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
}));
