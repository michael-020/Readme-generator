"use client"

import { redirect } from "next/navigation"
import { useState, useEffect } from "react"
import { Copy, Check, Download, Eye, Code, ExternalLink } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import { useReadmeStore } from "@/stores/readmeStore"

export function ReadmeDisplay() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"preview" | "raw">("preview")
  const { content, repoUrl } = useReadmeStore()

  const readme = content

  useEffect(() => {
    if (!readme) {
      redirect("/")
    }
  }, [readme])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(readme)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([readme], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "README.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getRepoName = (url: string) => {
    const match = url.match(/github\.com\/(.+?)\/(.+?)(?:\/|$)/)
    return match ? `${match[1]}/${match[2]}` : url
  }

  if (!readme) {
    return null
  }

  return (
    <div className="min-h-screen text-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-14 xl:px-40 pt-6 sm:pt-8 lg:pt-14">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    Generated README
                  </h1>
                  <div className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-medium w-fit">
                    ✓ Ready
                  </div>
                </div>
                {repoUrl && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-neutral-400">
                    <span className="text-sm sm:text-md">For repository:</span>
                    <a
                      href={repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-mono text-xs sm:text-xs transition-colors break-all sm:break-normal"
                    >
                      {getRepoName(repoUrl)}
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                )}
              </div>

              <div className="flex sm:hidden flex-col gap-3">
                <button
                  onClick={handleCopy}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    copied
                      ? "bg-green-900/30 text-green-400"
                      : "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-700 text-neutral-300 hover:bg-neutral-600 rounded-xl font-medium transition-all duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex mb-5">
          <div className="flex items-center gap-1 bg-neutral-800 rounded-xl w-full sm:w-fit">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-initial ${
                activeTab === "preview"
                  ? "bg-neutral-700 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm sm:text-base">Preview</span>
            </button>
            <button
              onClick={() => setActiveTab("raw")}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-initial ${
                activeTab === "raw"
                  ? "bg-neutral-700 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Code className="h-4 w-4" />
              <span className="text-sm sm:text-base">Markdown</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 sm:ml-auto">
            <button
              onClick={handleCopy}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                copied
                  ? "bg-green-900/30 text-green-400"
                  : "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-700 text-neutral-300 hover:bg-neutral-600 rounded-xl font-medium transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>

        <div className="bg-neutral-800/80 backdrop-blur-xl rounded-xl shadow-xl border border-neutral-700/50 overflow-hidden">
          {activeTab === "preview" ? (
            <div className="p-4 pt-0 sm:p-6 sm:pt-0 lg:p-8 lg:pt-0 overflow-auto max-h-[calc(100vh-280px)] sm:max-h-[calc(100vh-300px)]">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  components={{
                    pre: ({ children }) => (
                      <pre className="bg-neutral-900 p-4 sm:p-6 rounded-xl overflow-x-auto mb-6 border border-neutral-700 shadow-sm text-sm">
                        {children}
                      </pre>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 leading-relaxed text-neutral-300 text-sm sm:text-base">
                        {children}
                      </p>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 mt-6 text-white border-b border-neutral-700 pb-3">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 mt-6 text-white">
                        {children}
                      </h2>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-6 space-y-2 list-disc list-inside text-neutral-300 text-sm sm:text-base">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-6 space-y-2 list-decimal list-inside text-neutral-300 text-sm sm:text-base">
                        {children}
                      </ol>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-6 rounded-xl border border-neutral-700">
                        <table className="min-w-full divide-y divide-neutral-700">
                          {children}
                        </table>
                      </div>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-6 italic text-neutral-400 bg-blue-900/10 rounded-r-lg text-sm sm:text-base">
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors break-words"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {readme}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    copied
                      ? "bg-green-900/30 text-green-400"
                      : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                  }`}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre className="h-[calc(100vh-280px)] sm:h-[calc(100vh-300px)] overflow-auto p-4 sm:p-6 lg:p-8 text-xs sm:text-sm font-mono text-neutral-200 whitespace-pre-wrap leading-relaxed bg-neutral-900">
                {readme}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-neutral-400 px-2 sm:px-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span>Characters: {readme.length.toLocaleString()}</span>
            <span>Lines: {readme.split("\n").length.toLocaleString()}</span>
            <span>Words: {readme.split(/\s+/).length.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>README generated successfully</span>
          </div>
        </div>
      </div>
    </div>
  )
}
