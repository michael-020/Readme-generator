import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const generatedReadme = await prisma.generetedReadme.findMany()

        return NextResponse.json(
            { 
                generatedReadme
            },
            { status: 500 }
        )
    } catch (error) {
        console.error("Error while fetching generated: ", error)
        return NextResponse.json(
            { msg: "Internal server error" },
            { status: 500 }
        )
    }
}