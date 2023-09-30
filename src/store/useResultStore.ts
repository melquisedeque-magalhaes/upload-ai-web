import { create } from 'zustand'

interface resultStore {
  template: string | null
  setTemplate: (template: string | null) => void
  temperature: number
  setTemperature: (temperature: number) => void
  videoId: string | null
  setVideoId: (videoId: string | null) => void
}

export const useResultStore = create<resultStore>((set) => ({
  template: null,
  setTemplate: (template) => set(() => ({ template })),
  temperature: 0.5,
  setTemperature: (temperature) => set(() => ({ temperature })),
  videoId: null,
  setVideoId: (videoId) => set(() => ({ videoId })),
}))
