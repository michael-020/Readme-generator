import toast from "react-hot-toast"
import axios from "axios"
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
    let repoName = ""

    // --- Step 1: Clone Repo ---
    try {
      set({ isFetchingRepo: true, isReading: false, isGenerating: false, error: "" })

      const res = await axios.post("/api/fetch-repo", { repoUrl })
      repoName = res.data.repoName

    } catch (err: any) {
      const message = err.response?.data?.error || "Failed to fetch repository"
      set({ error: message, isFetchingRepo: false })
      toast.error(message)
      return
    } finally {
      set({ isFetchingRepo: false })
    }

    // --- Step 2: Read Files ---
    let files: string[] = []
    try {
      set({ isReading: true })

      const filesRes = await axios.post("/api/read-files", { repoName })
      files = filesRes.data.files

    } catch (err: any) {
      const message = err.response?.data?.error || "Failed to read repository files"
      set({ error: message, isReading: false })
      toast.error(message)
      return
    } finally {
      set({ isReading: false })
    }

    // --- Step 3: Generate README ---
    try {
      set({ isGenerating: true })

      const readmeRes = await axios.post("/api/generate-readme", { files, repoName })
      const readme = readmeRes.data.readme

      set({ content: readme, repoUrl })
      toast.success("README generated successfully!", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      })
    } catch (err: any) {
      const message = err.response?.data?.error || "Failed to generate README"
      set({ error: message })
      toast.error(message)
    } finally {
      set({ isGenerating: false })
    }
  },
}))
