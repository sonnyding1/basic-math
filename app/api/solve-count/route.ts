import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json(0);
    }
    const user = await prismadb.user.findUnique({
        where: {
            user_id: userId
        }
    });
    if (!user) {
        await prismadb.user.create({
            data: {
                user_id: userId,
                problems_solved: 0
            }
        });
        return NextResponse.json(0);
    } else {
        return NextResponse.json(user.problems_solved);
    }
}

export async function POST(
    req: Request
) {
    const body = await req.json();
    const { numberSolved } = body;
    const { userId } = auth();
    if (!userId) {
        return new NextResponse("", { status: 400 }); // change code?
    }
    const user = await prismadb.user.findUnique({
        where: {
            user_id: userId
        }
    });
    if (!user) {
        await prismadb.user.create({
            data: {
                user_id: userId,
                problems_solved: 0
            }
        });
        return NextResponse.json(0);
    }
    
    await prismadb.user.update({
        where: {
            user_id: userId
        },
        data: {
            problems_solved: numberSolved
        }
    })
    return new NextResponse("", { status: 200 });
}