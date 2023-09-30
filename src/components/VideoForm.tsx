import { FileVideo, Upload } from 'lucide-react'
import { Separator } from './ui/separator'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react'
import { getFFmpeg } from '@/lib/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { Progress } from './ui/progress'
import { api } from '@/lib/axios'
import { useResultStore } from '@/store/useResultStore'

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessage = {
  converting: 'Convertendo...',
  uploading: 'Carregando...',
  generating: 'Transcrevendo...',
  success: 'Sucesso!',
}

export function VideoForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('waiting')

  const promptRef = useRef<HTMLTextAreaElement | null>(null)

  const [progress, setProgress] = useState(0)

  const { setVideoId } = useResultStore()

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files) {
      return
    }

    const selectedFile = files[0]

    setVideoFile(selectedFile)
  }

  async function convertVideoToAudio(video: File) {
    setProgress(0)

    console.log('Converted started')

    const ffmpeg = await getFFmpeg()

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    // ffmpeg.on('log', (log) => { usado somete para debugar os erros no ffmpeg
    //   console.log(log)
    // })

    ffmpeg.on('progress', ({ progress }) => {
      const progressConvert = Math.round(progress * 100)

      setProgress(progressConvert)

      console.log('Converted progress ' + progressConvert)
    })

    ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3',
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], {
      type: 'audio/mpeg',
    })

    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg',
    })

    console.log('Converted finish')

    return audioFile
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault()

      const prompt = promptRef.current?.value

      if (!videoFile) {
        return
      }

      setStatus('converting')
      // convert video to audio
      const audioFile = await convertVideoToAudio(videoFile)

      const data = new FormData()

      data.append('file', audioFile)

      setStatus('uploading')

      const response = await api.post('/videos', data)

      const videoId = response.data.video.id

      setStatus('generating')

      await api.post(`/videos/${videoId}/transcription`, {
        prompt,
      })

      setStatus('success')

      setVideoId(videoId)
    } catch (err) {
      console.log(err)
    }
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null
    }

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form onSubmit={handleUploadVideo} className="space-y-6">
      <label
        htmlFor="video"
        className="relative overflow-hidden border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5 transition-colors"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none absolute inset-0"
          />
        ) : (
          <>
            <FileVideo className="w-4 h-4" />
            Selecionar video
          </>
        )}
      </label>
      <input
        onChange={handleFileSelected}
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
      />

      <Progress value={progress} />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Promp de transcricao</Label>
        <Textarea
          disabled={status !== 'waiting'}
          ref={promptRef}
          id="transcription_prompt"
          className="h-20 leading-relaxed p-4 resize-none"
          placeholder="Inclua palavras chaves mencionada no video, separadas por virgula (,)"
        />
      </div>

      <Button
        data-success={status === 'success'}
        disabled={!videoFile || status !== 'waiting'}
        className="w-full data-[success=true]:bg-emerald-500"
        type="submit"
      >
        {status === 'waiting' ? (
          <>
            Carregar video
            <Upload className="w-4 h-4 ml-2" />
          </>
        ) : (
          statusMessage[status]
        )}
      </Button>
    </form>
  )
}
