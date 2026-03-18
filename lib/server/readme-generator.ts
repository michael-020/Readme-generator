import { openai } from "@/lib/server/openai"
import { encode } from "gpt-tokenizer"

const MAX_TOKENS_PER_CHUNK = 10000
const MAX_LINES_PER_FILE = 100

export function truncateContent(content: string, maxLines = MAX_LINES_PER_FILE) {
  return content.split("\n").slice(0, maxLines).join("\n")
}

export function chunkFiles(files: any[], maxTokensPerChunk = MAX_TOKENS_PER_CHUNK) {
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

export async function summarizeChunk(chunk: string[], repoName: string) {
  const response = await openai.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content: `You are a senior software engineer performing a deep technical analysis of a codebase.
Your job is to extract structured, precise information from the code snippets provided.

For each batch of files, extract and return ALL of the following that you can identify:

1. FEATURES — concrete, user-facing or developer-facing capabilities implemented in the code

2. TECH STACK — every library, framework, database, tool, or service you see imported or configured.
   For each technology, identify which layer it belongs to: Frontend, Backend, Database, Authentication, DevOps, or other relevant layer names.
   Do NOT describe what it does — just the name and its layer.

3. ARCHITECTURE NOTES — key patterns: REST/WebSocket/GraphQL, auth strategy, folder structure conventions, ORM usage, state management

4. ENV VARIABLES — any process.env.* or env variable references you spot.
   For each variable, note which part of the codebase it belongs to:
   - "frontend" — variables prefixed with VITE_* or NEXT_PUBLIC_*, or found in a client/frontend directory
   - "backend" — server-side variables like PORT, DB URIs, JWT secrets, NODE_ENV
   - "shared" — if used in both
   Report only the variable name, not the value. Group them clearly by frontend/backend/shared.

5. PROJECT STRUCTURE — determine which of these applies:
   - MONOREPO: the project has clearly separate frontend and backend directories (e.g. /client + /server, /frontend + /backend, /web + /api, /app + /api, or similar). State the exact directory names.
   - SINGLE APP: one unified codebase (e.g. a Next.js full-stack app where frontend and backend coexist).
   State clearly which applies and name the exact folder names if monorepo.

6. DOCKER — if any Dockerfile, docker-compose.yml, or Docker-related config is present, describe what it containerizes (frontend only, backend only, or both) and how it's invoked.

7. NOTABLE IMPLEMENTATION DETAILS — anything technically interesting or worth highlighting.

Be specific. Use the actual names from the code. Do not fabricate anything not present in the files.`,
      },
      {
        role: "user",
        content: `Analyze these code files from the project "${repoName}" and extract all the information described above:\n\n${chunk.join("\n\n")}`,
      },
    ],
    max_tokens: 100_000,
  })

  return response.choices?.[0]?.message?.content || ""
}

export async function generateReadme(repoName: string, repoUrl: string, summaries: string[]) {
  const combinedAnalysis = summaries.join("\n\n---\n\n")

  const response = await openai.chat.completions.create({
    model: "gemini-flash-latest",
    messages: [
      {
        role: "system",
        content: `You are an expert technical writer who creates world-class GitHub README files.
Your READMEs are the gold standard for open source documentation — clear, complete, and visually well-structured using Markdown.

STRICT RULES:
- Output ONLY raw Markdown. No explanations, no preamble, no "Here is your README" — just the Markdown content itself.
- Never wrap the output in a code block.
- Every section must be genuinely useful. No filler content or generic boilerplate.
- The clone URL MUST be the exact repo URL provided to you. Never invent or substitute a URL.
- Environment variable names must come only from the code analysis. Never invent variable names.
- Tech stack entries must come only from the code analysis. Never invent technologies.
- Descriptions must reflect what the code actually does, not generic assumptions.
- DO NOT include a Project Structure section.
- DO NOT include a Contributing section.
- DO NOT include a License section.

---

README STRUCTURE (follow exactly in this order):

# {Project Name}

> One-sentence punchy description of what the project does and who it's for.

{2–3 sentence paragraph expanding on the purpose, the problem it solves, and what makes it interesting or unique.}

## ✨ Features

- Bulleted list of concrete features, each starting with a relevant emoji.
- Be specific — name actual capabilities, not generic statements like "fast performance".

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Next.js, Tailwind CSS, ... |
| Backend | Node.js, Express, ... |
| Database | PostgreSQL, MongoDB, ... |
| Authentication | JWT, NextAuth, ... |
| DevOps | Docker, ... |

RULES for this table:
- Exactly 2 columns: "Layer" and "Technology". No third column of any kind.
- Layer groups technologies by concern. Use only layers that are actually present in the codebase.
- Technology lists actual names comma-separated in one cell per row.

---

## 🚀 Getting Started

### Prerequisites
List required tools (Node.js version, package manager, Docker if applicable, etc.)

---

CRITICAL — SETUP STEPS FORMAT:

Inspect the project structure from the analysis to determine the correct format:

CASE A — MONOREPO (separate /client + /server, or /frontend + /backend, or similar):
Use numbered steps like this exactly:

### 1. Clone the repository

\`\`\`bash
git clone {EXACT_REPO_URL}
\`\`\`

\`\`\`bash
cd {repo-root-folder}
\`\`\`

### 2. Configure environment variables

**Backend** — \`/{backend-folder}/.env\`

\`\`\`env
BACKEND_VAR=value   # what it's for
\`\`\`

**Frontend** — \`/{frontend-folder}/.env\`

\`\`\`env
FRONTEND_VAR=value   # what it's for
\`\`\`

### 3. Run the backend

\`\`\`bash
cd {backend-folder}
npm install
npm run dev
\`\`\`

Runs on \`http://localhost:{PORT from env or default}\`

### 4. Run the frontend

\`\`\`bash
cd {frontend-folder}
npm install
npm run dev
\`\`\`

Runs on \`http://localhost:{Vite default 5173 or Next.js default 3000}\`

---

CASE B — SINGLE UNIFIED APP (Next.js full-stack, or one package.json at root):
Use this format:

### Installation

\`\`\`bash
git clone {EXACT_REPO_URL}
cd {repo-folder}
npm install
\`\`\`

### Environment Variables

Create a \`.env\` file in the root:

\`\`\`env
VARIABLE=value   # what it's for
\`\`\`

### Running the App

\`\`\`bash
# Development
npm run dev

# Production
npm run build
npm start
\`\`\`

---

DOCKER SECTION — include ONLY if Docker files were found in the analysis:

## 🐳 Docker

Provide a brief intro sentence, then the exact commands to build and run. Separate commands for frontend/backend if they are containerized individually.

\`\`\`bash
# Example — adapt to what the analysis actually shows
docker build -t {image-name} ./{folder-if-applicable}
docker run -p {port}:{port} {image-name}
\`\`\`

Or if docker-compose is present:

\`\`\`bash
docker-compose up --build
\`\`\`

Do NOT invent Docker commands. Only include what can be inferred from the actual Docker files in the analysis.`,
      },
      {
        role: "user",
        content: `Generate a complete README for the project with the following details:

Project name: ${repoName}
Repository URL: ${repoUrl}

IMPORTANT: Use "${repoUrl}" as the exact clone URL. Do not alter or substitute it.
IMPORTANT: Tech Stack table must have exactly 2 columns — "Layer" and "Technology". No Purpose or Description column.
IMPORTANT: Do NOT include Project Structure, Contributing, or License sections.
IMPORTANT: For the Getting Started section — if the analysis shows a monorepo with separate frontend and backend folders, use CASE A (numbered sequential steps with separate backend and frontend run instructions). If it is a single unified app, use CASE B. Choose based solely on what the analysis says about project structure.
IMPORTANT: Only include a Docker section if Docker files were confirmed in the analysis.

Here is the full technical analysis of the codebase:

${combinedAnalysis}`,
      },
    ],
    max_tokens: 100_000,
  })

  return response.choices?.[0]?.message?.content || "README generation failed."
}