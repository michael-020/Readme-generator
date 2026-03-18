import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { chunkFiles, generateReadme, summarizeChunk } from "@/lib/server/readme-generator"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, repoName, repoUrl } = await request.json()

    const files = await prisma.fileData.findMany({
      where: { sessionId },
    })

    if (!files || !Array.isArray(files)) {
      return NextResponse.json({ error: "Files array is required" }, { status: 400 })
    }

    const filteredFiles = files.filter((file: any) => {
      const skip =
        file.path.includes("node_modules") ||
        file.path.endsWith(".test.ts") ||
        file.path.endsWith(".spec.ts") ||
        file.path.endsWith(".lock") ||
        file.path.endsWith(".json") ||
        file.path.endsWith(".config.js")
      return !skip
    })

    const chunks = chunkFiles(filteredFiles)

    const summaries: string[] = []
    for (const chunk of chunks) {
      const summary = await summarizeChunk(chunk, repoName)
      summaries.push(summary)
    }

    const readme = await generateReadme(repoName, repoUrl, summaries)

    return NextResponse.json({ readme })
  } catch (error) {
    console.error("README generation error:", error)
    return NextResponse.json({ error: "Failed to generate README" }, { status: 500 })
  }
}