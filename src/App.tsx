import { useEffect } from 'react'

import { useTheme } from './hooks/useTheme'
import { Header } from './components/Header'
import { Textarea } from './components/ui/textarea'
import { Wand2 } from 'lucide-react'
import { Separator } from './components/ui/separator'
import { Label } from './components/ui/label'
import { Button } from './components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select'
import { Slider } from './components/ui/slider'
import { VideoForm } from './components/VideoForm'
import { PromptSelect } from './components/PromptSelect'
import { useResultStore } from './store/useResultStore'
import { useCompletion } from 'ai/react'

export function App() {
  const { handleChangeTheme } = useTheme()

  const { setTemperature, temperature, videoId } = useResultStore()

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      temperature,
      videoId,
    },
    headers: {
      'Content-type': 'application/json',
    },
  })

  useEffect(() => {
    handleChangeTheme()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-6 flex gap-6 flex-col  md:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              value={input}
              onChange={handleInputChange}
              className="resize-none p-4 leading-relaxed"
              placeholder="Inclua o prompt para IA..."
            />
            <Textarea
              value={completion}
              className="resize-none p-4 leading-relaxed"
              placeholder="Resultado gerado pela IA..."
              readOnly
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Lembre-se: voce pode utilizar a variavel{' '}
            <code className="text-primary">{'{trascription}'}</code> no seu
            prompt para adicionar
          </p>
        </div>

        <aside className="w-80 space-y-6">
          <VideoForm />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label>Prompt</Label>
              <PromptSelect setInput={setInput} />
            </div>

            <div className="space-y-4">
              <Label>Modelo</Label>
              <Select disabled defaultValue="gpt3.5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic leading-relaxed">
                Voce poderar customizar essa opcao em breve
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperatura</Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />

              <span className="block text-xs text-muted-foreground italic leading-relaxed">
                Valores mais altos tendem a deixar o resultado mais criativo mas
                tambem com possiveis erros
              </span>
            </div>

            <Button disabled={isLoading} type="submit" className="w-full">
              Executar
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}
