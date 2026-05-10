import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface LayoutState {
  isSidebarOpen: boolean;
  theme: Theme;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      isSidebarOpen: false,
      theme: 'light',
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      closeSidebar: () => set({ isSidebarOpen: false }),
      openSidebar: () => set({ isSidebarOpen: true }),
      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'layout-storage',
      partialize: (state) => ({ theme: state.theme }), // Only persist theme
    }
  )
);
