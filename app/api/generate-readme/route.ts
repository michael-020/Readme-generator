import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/server/openai" 
import { encode } from "gpt-tokenizer"

const MAX_TOKENS_PER_CHUNK = 6000
const MAX_LINES_PER_FILE = 100

function truncateContent(content: string, maxLines = MAX_LINES_PER_FILE) {
  return content.split("\n").slice(0, maxLines).join("\n")
}

function chunkFiles(files: any[], maxTokensPerChunk = MAX_TOKENS_PER_CHUNK) {
  const chunks: string[][] = []
  let currentChunk: string[] = []
  let currentTokenCount = 0

  for (const file of files) {
    const content = truncateContent(file.content)
    const entry = `### ${file.path}\n\`\`\`\n${content}\n\`\`\``
    const tokens = encode(entry).length

    if (currentTokenCount + tokens > maxTokensPerChunk) {
      chunks.push(currentChunk)
      currentChunk = []
      currentTokenCount = 0
    }

    currentChunk.push(entry)
    currentTokenCount += tokens
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }

  return chunks
}

async function summarizeChunkWithGemini(chunk: string[], repoName: string) {
  const prompt = `
  You are a senior developer. Summarize the functionality of a GitHub project called "${repoName}" based on the following code snippets. Focus on the features and high-level purpose.
  ${chunk.join("\n\n")}`.trim()

  const response = await openai.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content: "You are a developer assistant summarizing code for documentation.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 100_000,
  })

  return response.choices?.[0]?.message?.content || ""
}

async function generateReadmeWithGemini(repoName: string, summaries: string[]) {
  const prompt = `
  You're a senior dev writing a GitHub README for the project "${repoName}" using the following summaries.

  📌 Guidelines:
  - ✅ Write a short and engaging introduction using emojis.
  - ✅ Include key features as a bullet list (with emojis).
  - ✅ List technologies used (grouped by Backend / Frontend).
  - ✅ Add a Getting Started section with install/run steps.
  - ❌ DO NOT include raw code or file listings.

  Summaries:
  ${summaries.join("\n\n")}
    `.trim()

  const response = await openai.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content: "You're a helpful technical writer creating clean, modern README files.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 100_000,
  })

  return response.choices?.[0]?.message?.content || "README generation failed."
}

export async function POST(request: NextRequest) {
  try {
    const { files, repoName } = await request.json()

    if (!files || !Array.isArray(files)) {
      return NextResponse.json({ error: "Files array is required" }, { status: 400 })
    }

    const filteredFiles = files.filter((file: any) => {
      const isCodeHeavy =
        file.path.includes("/api/") ||
        file.path.includes("node_modules") ||
        file.path.endsWith(".test.ts") ||
        file.path.endsWith(".spec.ts") ||
        file.path.endsWith(".lock") ||
        file.path.endsWith(".json") ||
        file.path.endsWith(".config.js")
      return !isCodeHeavy
    })

    const chunks = chunkFiles(filteredFiles)

    const summaries = []
    for (const chunk of chunks) {
      const summary = await summarizeChunkWithGemini(chunk, repoName)
      summaries.push(summary)
    }

    const readme = await generateReadmeWithGemini(repoName, summaries)

    return NextResponse.json({ readme })
  } catch (error) {
    console.error("README generation error:", error)
    return NextResponse.json({ error: "Failed to generate README" }, { status: 500 })
  }
}
