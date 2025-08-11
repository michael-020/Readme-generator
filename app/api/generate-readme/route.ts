import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/server/openai"

export async function POST(request: NextRequest) {
  try {
    const { files } = await request.json()

    if (!files || !Array.isArray(files)) {
      return NextResponse.json({ error: "Files array is required" }, { status: 400 })
    }

    const prompt = `
You are a code documentation expert. Based on the following list of files and their contents, generate a detailed, professional README.md file.

Only output the README content. Do not include any commentary.

${files.map((file: any) => `### ${file.path}\n\`\`\`\n${file.content}\n\`\`\``).join("\n\n")}
`

    const response = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: "You are an expert technical writer and developer. Do not add any license information.Create a clean, concise README.md file based on project code.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 100000,
    })

    const readme = response.choices?.[0]?.message?.content || "README generation failed."
    return NextResponse.json({ readme })
  } catch (error) {
    console.error("README generation error:", error)
    return NextResponse.json({ error: "Failed to generate README" }, { status: 500 })
  }
}
