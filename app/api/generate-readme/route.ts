import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/server/openai"

export async function POST(request: NextRequest) {
  try {
    const { files } = await request.json()

    if (!files || !Array.isArray(files)) {
      return NextResponse.json({ error: "Files array is required" }, { status: 400 })
    }

    const prompt = `
      You are a senior developer and technical writer helping generate beautiful README files for open source GitHub projects.

      Based on the following list of files and their contents, generate a clean, high-level, user-friendly README.md file.

      The README should include:
      - A short and engaging introduction with relevant emojis.
      - A bullet-point list of the key features (using emojis).
      - Technologies used (grouped into Backend / Frontend).
      - A "Getting Started" section that explains how to install and run the project locally.
      - Keep the language friendly and accessible.
      - Do NOT include API endpoints, WebSocket message types, or internal architecture.
      - Do NOT include any licensing information.
      - Keep the README concise, helpful, and visually appealing.

      Only output the final README content. No commentary or extra explanations.

      ${files.map((file: any) => `### ${file.path}\n\`\`\`\n${file.content}\n\`\`\``).join("\n\n")}
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
