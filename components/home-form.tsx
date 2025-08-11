"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Github, Loader2, Sparkles, ArrowRight } from "lucide-react"
import { useReadmeStore } from "@/stores/readmeStore"

export function HomeForm() {
  const [repoUrl, setRepoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isFocused, setIsFocused] = useState(false)
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <label htmlFor="repo-url" className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          GitHub Repository URL
        </label>
        <div className="relative group">
          <Github className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${
            isFocused ? 'text-blue-500' : 'text-neutral-400'
          }`} />
          <input
            id="repo-url"
            type="url"
            placeholder="https://github.com/username/repository"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`pl-12 pr-4 h-14 w-full rounded-xl border-2 transition-all duration-200 text-base font-medium
              ${isFocused 
                ? 'border-blue-500 bg-white dark:bg-neutral-800 shadow-lg shadow-blue-500/10' 
                : 'border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-500'
              }
              text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 
              focus:outline-none focus:ring-4 focus:ring-blue-500/20
              disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isLoading}
          />
          {repoUrl && !error && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
        
        {/* URL Helper Text */}
        {!repoUrl && (
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <div className="w-1 h-1 bg-neutral-400 rounded-full"></div>
            <span>Paste any public GitHub repository URL</span>
          </div>
        )}
      </div>

      {error && (
        <div className="relative">
          <div className="flex items-start gap-3 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800/50">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Oops! Something went wrong</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !repoUrl.trim()}
        className={`relative w-full h-14 text-base font-semibold rounded-xl transition-all duration-300 transform overflow-hidden
          ${isLoading || !repoUrl.trim()
            ? "bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
          }`}
      >
        <div className="flex items-center justify-center gap-3">
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing Repository...</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
              </div>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Generate README with AI</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </div>
        
        {/* Shimmer effect for enabled button */}
        {!isLoading && repoUrl.trim() && (
          <div className="absolute inset-0 -top-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        )}
      </button>

      {/* Progress indicator when loading */}
      {isLoading && (
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
            <span>Processing your repository...</span>
            <span>This may take a few moments</span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full animate-pulse" style={{width: '45%'}}></div>
          </div>
        </div>
      )}
    </form>
  )
}