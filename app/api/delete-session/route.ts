import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const { sessionId } = await req.json()

        if(!sessionId)
            return NextResponse.json(
                { msg: "Invalid sessionId" },
                { status: 401}
            )

        const findSession = await prisma.fileSession.findUnique({
            where: {
                id: sessionId
            }
        })

        if(!findSession){
            return NextResponse.json(
                { msg: "Session not found" },
                { status: 404 }
            )
        }

        await prisma.fileSession.delete({
            where: {
                id: sessionId
            }
        })
        return NextResponse.json(
            { msg: "Deleted session successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error while deleting session", error)
        return NextResponse.json(
            { msg: "Internal server error" },
            { status: 500 }
        )
    }
}