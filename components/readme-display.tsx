"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Check } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import { useReadmeStore } from "@/stores/readmeStore"

export function ReadmeDisplay() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const { content, repoUrl } = useReadmeStore()

  const readme = content

  useEffect(() => {
    if (!readme) {
      router.push("/")
    }
  }, [readme, router])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(readme)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleBack = () => {
    router.push("/")
  }

  if (!readme) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Generator
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Generated README</h1>
          {repoUrl && <p className="text-gray-600 dark:text-gray-300 mt-2">For: {repoUrl}</p>}
        </div>
        <Button onClick={handleCopy} className="flex items-center gap-2">
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy README
            </>
          )}
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
        {/* Left column - Raw Markdown */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Raw Markdown</h2>
          <div className="h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <pre className="h-full overflow-auto p-4 text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {readme}
            </pre>
          </div>
        </div>

        {/* Right column - Rendered Preview */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preview</h2>
          <div className="h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-auto">
            <div className="p-6 prose prose-gray dark:prose-invert max-w-none prose-headings:mb-4 prose-headings:mt-6 prose-p:mb-4 prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-1">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  // Custom styling for code blocks
                  code: ({ node, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "")
                    return (
                      <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    )
                  },
                  // Custom styling for pre blocks (code blocks)
                  pre: ({ children }) => (
                    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto mb-4">
                      {children}
                    </pre>
                  ),
                  // Custom styling for paragraphs to ensure proper spacing
                  p: ({ children }) => (
                    <p className="mb-4 leading-relaxed">{children}</p>
                  ),
                  // Custom styling for headings
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-4 mt-6 text-gray-900 dark:text-white">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold mb-4 mt-6 text-gray-900 dark:text-white">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold mb-3 mt-5 text-gray-900 dark:text-white">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-lg font-semibold mb-3 mt-4 text-gray-900 dark:text-white">{children}</h4>
                  ),
                  // Custom styling for lists
                  ul: ({ children }) => (
                    <ul className="mb-4 space-y-1 list-disc list-inside">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 space-y-1 list-decimal list-inside">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="mb-1 leading-relaxed">{children}</li>
                  ),
                  // Custom styling for tables
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{children}</td>
                  ),
                  // Custom styling for blockquotes
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 mb-4 italic text-gray-700 dark:text-gray-300">
                      {children}
                    </blockquote>
                  ),
                  // Handle line breaks
                  br: () => <br className="mb-2" />,
                }}
              >
                {readme}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}