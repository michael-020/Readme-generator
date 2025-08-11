"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Github } from "lucide-react"
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

    // Basic GitHub URL validation
    const githubUrlPattern = /^https:\/\/github\.com\/[\w\-.]+\/[\w\-.]+\/?$/
    if (!githubUrlPattern.test(repoUrl.trim())) {
      setError("Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Step 1: Clone repository
      const cloneResponse = await fetch("/api/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repoUrl.trim() }),
      })

      if (!cloneResponse.ok) {
        throw new Error("Failed to clone repository")
      }

      const { repoName } = await cloneResponse.json()

      // Step 2: Get files
      const filesResponse = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName }),
      })

      if (!filesResponse.ok) {
        throw new Error("Failed to get repository files")
      }

      const { files } = await filesResponse.json()

      // Step 3: Generate README
      const readmeResponse = await fetch("/api/generate-readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files, repoName }),
      })

      if (!readmeResponse.ok) {
        throw new Error("Failed to generate README")
      }

      const { readme } = await readmeResponse.json()

      // Navigate to results page with the generated README
      const params = new URLSearchParams({
        readme: encodeURIComponent(readme),
        repoUrl: encodeURIComponent(repoUrl.trim()),
      })
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
        <Label htmlFor="repo-url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          GitHub Repository URL
        </Label>
        <div className="relative">
          <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            id="repo-url"
            type="url"
            placeholder="https://github.com/username/repository"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="pl-10 h-12 text-base"
            disabled={isLoading}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
          {error}
        </div>
      )}

      <Button type="submit" disabled={isLoading || !repoUrl.trim()} className="w-full h-12 text-base font-medium">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating README...
          </>
        ) : (
          "Generate README"
        )}
      </Button>
    </form>
  )
}
