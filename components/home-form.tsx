"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Github, Loader2, ArrowRight } from "lucide-react"
import { useReadmeStore } from "@/stores/readmeStore"
import { motion } from "framer-motion"

export function HomeForm() {
  const [isFocused, setIsFocused] = useState(false)
  const [inputVal, setInputVal] = useState("")
  const router = useRouter()
  const {
    generateReadmeFromRepo,
    isFetchingRepo,
    isReading,
    isGenerating,
    error,
    setError
  } = useReadmeStore()
  const isLoading = isFetchingRepo || isReading || isGenerating

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputVal.trim()) {
      setError("Please enter a GitHub repository URL")
      return
    }

    const githubUrlPattern = /^https:\/\/github\.com\/[\w\-.]+\/[\w\-.]+\/?$/
    if (!githubUrlPattern.test(inputVal.trim())) {
      setError("Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)")
      return
    }

    setError("")

    await generateReadmeFromRepo(inputVal.trim())

    setInputVal("")

    router.push("/readme")
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        <div className="relative">
          <label htmlFor="repo-url" className="block mb-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            GitHub Repository URL
          </label>
          <div className="relative group">
            <Github className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${
              isFocused ? 'text-neutral-200' : 'text-neutral-700'
            }`} />
            <input
              id="repo-url"
              type="url"
              placeholder="https://github.com/username/repository"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`pl-10 sm:pl-12 pr-4 sm:pr-36 h-12 sm:h-14 w-full hover:shadow-2xl hover:shadow-neutral-600 rounded-xl border-2 transition-all duration-200 text-sm sm:text-base font-medium
                ${isFocused 
                  ? ' bg-white dark:bg-neutral-800 shadow-lg shadow-neutral-500/10' 
                  : 'border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-500'
                }
                text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 
                focus:outline-none focus:ring-0 focus:ring-neutral-500/20
                disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isLoading}
                />
            {inputVal && !error && (
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 ">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Mobile Generate Button - Full Width */}
          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className={`sm:hidden mt-4 w-full h-12 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2
              ${isLoading || !inputVal.trim()
                ? "bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                : "bg-neutral-900 dark:bg-neutral-200 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-300 shadow-md hover:shadow-lg"
              }`}
              >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>Generate README</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>

          {/* Desktop Generate Button - Positioned Inside Input */}
          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className={`hidden sm:block absolute cursor-pointer right-2 top-[36px] h-10 px-4 text-sm font-semibold rounded-lg transition-all duration-300 items-center gap-2
              ${isLoading || !inputVal.trim()
                ? "bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                : "bg-neutral-200 text-black hover:to-blue-800 shadow-md hover:shadow-lg"
              }`}
              >
            <div className="flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </div>
          </button>
        </div>

        {error && (
          <div className="relative">
            <div className="flex items-start gap-3 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 sm:p-4 rounded-xl border border-red-200 dark:border-red-800/50">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                {error === "" ? 
                  <p className="font-medium">Oops! Something went wrong</p> : 
                  <p className="mt-1 break-words">{error}</p>
                }
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 text-xs text-neutral-600 dark:text-neutral-400">
              <span className="text-center sm:text-left">
                {isFetchingRepo && "Fetching the repository..."}
                {isReading && "Reading project files..."}
                {isGenerating && "Generating README with AI..."}
              </span>
              <span className="text-center sm:text-right text-neutral-500 dark:text-neutral-500">This may take a few moments</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: isFetchingRepo ? "0%" : isReading ? "50%" : "90%"
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  )
}