import { useThemeStore } from '@/store/useThemeStore'
import { useCallback } from 'react'

export function useTheme() {
  const { setTheme, theme } = useThemeStore()

  const handleChangeTheme = useCallback(() => {
    const changeTheme = theme === 'dark' ? 'light' : 'dark'

    setTheme(changeTheme)

    const htmlElement = document.getElementsByTagName('html')[0]

    if (theme === 'dark') {
      htmlElement.classList.add('dark')
    }

    if (theme === 'light') {
      htmlElement.classList.remove('dark')
    }
  }, [setTheme, theme])

  return {
    theme,
    handleChangeTheme,
  }
}
