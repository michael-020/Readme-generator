import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json()

    await prisma.generetedReadme.create({
        data: {
            repoUrl
        }
    })

    return NextResponse.json(
        { msg: "Stored in database" },
        { status: 200 }
    )
  } catch (error) {
    console.error("DB error:", error)
    return NextResponse.json({ msg: "Interanl server error"}, { status: 500 })
  }
}
