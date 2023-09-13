import { create } from 'zustand'

interface themeType {
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void
}

export const useThemeStore = create<themeType>((set) => ({
  theme: 'dark',
  setTheme: (theme) => set(() => ({ theme })),
}))
