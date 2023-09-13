import { useTheme } from '@/hooks/useTheme'
import { Button } from './ui/button'
import { Separator } from './ui/separator'

import { SunMoon, MoonStar, Github } from 'lucide-react'

export function Header() {
  const { handleChangeTheme, theme } = useTheme()

  return (
    <header className="px-6 py-5 flex items-center justify-between border-b">
      <h1 className="font-bold text-xl">Upload.ai</h1>

      <div className="flex items-center justify-center gap-3">
        <span className="text-sm text-muted-foreground">
          Feito com 💜 Melqui Sodré.
        </span>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="outline">
          <Github className="w-4 h-4 mr-2" /> Github
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {theme === 'dark' ? (
          <Button onClick={handleChangeTheme}>
            <SunMoon className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleChangeTheme}>
            <MoonStar className="w-4 h-4" />
          </Button>
        )}
      </div>
    </header>
  )
}
