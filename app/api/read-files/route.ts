import octokit from "@/lib/server/octokit"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { repoName } = await request.json()
    if (!repoName) {
      return NextResponse.json({ error: "Repository name is required" }, { status: 400 })
    }

    const [owner, repo] = repoName.split("/")

    const { data: tree } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: "HEAD",
      recursive: "true",
    })

    const filteredFiles = tree.tree
      ?.filter(
        (item: any) =>
          item.type === "blob" &&
          item.path &&
          !item.path.includes("node_modules") &&
          !item.path.includes(".git") &&
          !item.path.includes("dist/") &&
          !item.path.includes("build/") &&
          !item.path.match(/\.(png|jpg|jpeg|gif|svg|ico|pdf|zip|tar|gz)$/i),
      )
      .slice(0, 20)

    const filesWithContent = await Promise.all(
      filteredFiles.map(async (file: any) => {
        const contentRes = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.path!,
        })

        const contentData = contentRes.data as any
        let content = ""
        if (contentData.encoding === "base64") {
          content = Buffer.from(contentData.content, "base64").toString("utf-8")
        }

        return {
          path: file.path,
          content,
        }
      })
    )
    // console.log("files: ", filesWithContent)
    return NextResponse.json({ files: filesWithContent })
  } catch (error) {
    console.error("Files error:", error)
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
  }
}
