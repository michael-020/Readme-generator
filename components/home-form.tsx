"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Github, Loader2 } from "lucide-react"
import { useReadmeStore } from "@/stores/readmeStore"

export function HomeForm() {
  const [repoUrl, setRepoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { setContent, setUrl } = useReadmeStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL")
      return
    }

    const githubUrlPattern = /^https:\/\/github\.com\/[\w\-.]+\/[\w\-.]+\/?$/
    if (!githubUrlPattern.test(repoUrl.trim())) {
      setError("Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const cloneResponse = await fetch("/api/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repoUrl.trim() }),
      })

      if (!cloneResponse.ok) {
        throw new Error("Failed to clone repository")
      }

      const { repoName } = await cloneResponse.json()

      const filesResponse = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName }),
      })

      if (!filesResponse.ok) {
        throw new Error("Failed to get repository files")
      }

      const { files } = await filesResponse.json()

      const readmeResponse = await fetch("/api/generate-readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files, repoName }),
      })

      if (!readmeResponse.ok) {
        throw new Error("Failed to generate README")
      }

      const { readme } = await readmeResponse.json()

      setUrl(repoUrl)
      setContent(readme)
      router.push(`/readme`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="repo-url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          GitHub Repository URL
        </label>
        <div className="relative">
          <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            id="repo-url"
            type="url"
            placeholder="https://github.com/username/repository"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="pl-10 h-12 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            disabled={isLoading}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !repoUrl.trim()}
        className={`w-full h-12 text-base font-medium rounded-md transition-colors ${
          isLoading || !repoUrl.trim()
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating README...
          </span>
        ) : (
          "Generate README"
        )}
      </button>
    </form>
  )
}