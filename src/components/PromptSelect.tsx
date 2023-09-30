import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { api } from '@/lib/axios'

interface Prompt {
  id: string
  title: string
  template: string
}

interface PromptSelectProps {
  setInput: React.Dispatch<React.SetStateAction<string>>
}

export function PromptSelect({ setInput }: PromptSelectProps) {
  const [prompts, setPrompts] = useState<Prompt[] | null>(null)

  useEffect(() => {
    api.get('/prompts').then((response) => setPrompts(response.data))
  }, [])

  function handleGetTemplate(id: string) {
    const prompSelect = prompts?.find((prompt) => prompt.id === id)

    if (!prompSelect) {
      return
    }

    setInput(prompSelect.template)
  }

  return (
    <Select onValueChange={handleGetTemplate}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt..." />
      </SelectTrigger>
      <SelectContent>
        {prompts?.map((prompt) => (
          <SelectItem value={prompt.id} key={prompt.id}>
            {prompt.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
