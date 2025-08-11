// store/readmeStore.ts
import { create } from 'zustand'

interface ReadmeState {
  content: string
  repoUrl: string
  setUrl: (url: string) => void
  setContent: (readme: string) => void
}

export const useReadmeStore = create<ReadmeState>((set) => ({
  content: "",
  repoUrl: "",
  setUrl: (url) => set({ repoUrl: url }),
  setContent: (readme) => set({ content: readme }),
}))
