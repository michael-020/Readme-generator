import { exec } from "child_process"
import { mkdtempSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"

export function cloneRepo(repoUrl: string): Promise<string> {
  const tempDir = mkdtempSync(join(tmpdir(), "repo-"))
  return new Promise((resolve, reject) => {
    exec(`git clone --depth=1 ${repoUrl} ${tempDir}`, (err) => {
      if (err) return reject(err)
      resolve(tempDir)
    })
  })
}
