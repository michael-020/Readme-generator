import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/server/openai"

export async function POST(request: NextRequest) {
  try {
    const { files } = await request.json()

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


    const prompt = `
      You are a senior developer and technical writer helping generate clean, engaging, and beginner-friendly README.md files for GitHub projects.

      From the following filtered list of files and their *relevant content*, generate a concise, helpful, and appealing README file. 

      📌 Guidelines:
      - ✅ Write a short and engaging introduction using emojis.
      - ✅ Include key features as a bullet list (with emojis).
      - ✅ List technologies used (grouped by Backend / Frontend).
      - ✅ Add a Getting Started section with install/run steps.
      - ❌ DO NOT include any raw code, file listings, or API route details.
      - ❌ DO NOT show full implementations or deep technical internals.
      - ❌ DO NOT mention licensing or testing code unless specifically important.

      Only return the final README content — no extra commentary.

      ${filteredFiles.map((file: any) => `### ${file.path}\n\`\`\`\n${file.content}\n\`\`\``).join("\n\n")}
    `


    const response = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: "You are an expert open-source maintainer and technical writer. You write high-quality, beginner-friendly, and visually appealing README files for GitHub projects. You never include license sections or deep internal documentation like API routes or socket protocols. Feel free to use emojis in section headers or bullet points to make the README more engaging.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 100_000,
    })

    const readme = response.choices?.[0]?.message?.content || "README generation failed."
    return NextResponse.json({ readme })
  } catch (error) {
    console.error("README generation error:", error)
    return NextResponse.json({ error: "Failed to generate README" }, { status: 500 })
  }
}
