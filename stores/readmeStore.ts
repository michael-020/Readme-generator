// stores/readmeStore.ts
import { create } from "zustand"

interface ReadmeState {
  content: string
  repoUrl: string

  isFetchingRepo: boolean
  isReading: boolean
  isGenerating: boolean
  error: string

  setUrl: (url: string) => void
  setContent: (readme: string) => void
  setError: (error: string) => void
  generateReadmeFromRepo: (repoUrl: string) => Promise<void>
}

export const useReadmeStore = create<ReadmeState>((set) => ({
  content: "",
  repoUrl: "",

  isFetchingRepo: false,
  isReading: false,
  isGenerating: false,
  error: "",

  setUrl: (url) => set({ repoUrl: url }),
  setContent: (readme) => set({ content: readme }),
  setError: (error) => set({ error }),

  generateReadmeFromRepo: async (repoUrl: string) => {
    set({ isFetchingRepo: true, isReading: false, isGenerating: false, error: "" })

    try {
      const cloneRes = await fetch("/api/fetch-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      })

      if (!cloneRes.ok) throw new Error("Failed to clone repository")

      const { repoName } = await cloneRes.json()
      set({ isFetchingRepo: false, isReading: true })

      const filesRes = await fetch("/api/read-files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName }),
      })

      if (!filesRes.ok) throw new Error("Failed to read repository files")

      const { files } = await filesRes.json()
      set({ isReading: false, isGenerating: true })

      const readmeRes = await fetch("/api/generate-readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files, repoName }),
      })

      if (!readmeRes.ok) throw new Error("Failed to generate README")

      const { readme } = await readmeRes.json()

      set({ content: readme, repoUrl, isGenerating: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        isFetchingRepo: false,
        isReading: false,
        isGenerating: false,
      })
    }
  },
}))
