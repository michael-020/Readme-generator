import { cloneRepo } from "@/lib/cloneRepo"
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json()

    if (!repoUrl) {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 })
    }

    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git|\/)?$/)
    if (!match) {
      return NextResponse.json({ error: "Invalid GitHub URL format" }, { status: 400 })
    }

    const [, owner, repo] = match
    const repoName = `${owner}/${repo}`

    try {
      await axios.head(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      })
    } catch (err: any) {
      console.error("GitHub API error:", err.response?.status)
      if (err.response?.status === 404) {
        return NextResponse.json({ error: "Repository not found on GitHub" }, { status: 404 })
      }

      return NextResponse.json(
        { error: "GitHub API error", details: err.message },
        { status: err.response?.status || 500 }
      )
    }

    return NextResponse.json({ repoName })
  } catch (error) {
    console.error("Fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch repository" }, { status: 500 })
  }
}
