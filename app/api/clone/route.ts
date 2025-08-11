import { cloneRepo } from "@/lib/cloneRepo"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs"

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json()

    if (!repoUrl) {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 })
    }

    // // Extract owner and repo name from GitHub URL
    // const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    // if (!match) {
    //   return NextResponse.json({ error: "Invalid GitHub URL format" }, { status: 400 })
    // }

    // const [, owner, repo] = match
    // const repoName = `${owner}/${repo.replace(/\.git$/, "")}`
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git|\/)?$/)
    if (!match) {
      return NextResponse.json({ error: "Invalid GitHub URL format" }, { status: 400 })
    }

    const [, owner, repo] = match
    const repoName = `${owner}/${repo}`
    
    console.log("repo url: ", repoUrl)
    const clone = await cloneRepo(repoUrl)
    console.log("clone: ", clone)

    const files = fs.readdirSync(clone)
    console.log("Files in cloned repo:", files)

    // Simulate cloning process (in real implementation, you'd clone the repo)
    // await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({ repoName })
  } catch (error) {
    console.error("Clone error:", error)
    return NextResponse.json({ error: "Failed to clone repository" }, { status: 500 })
  }
}
