import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({
            numberSolved: 0,
            level: 1,
            xp: 0
        });
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
                problems_solved: 0,
                level: 1,
                xp: 0
            }
        });
        return NextResponse.json({
            numberSolved: 0,
            level: 1,
            xp: 0
        });
    } else {
        return NextResponse.json({
            numberSolved: user.problems_solved,
            level: user.level,
            xp: user.xp
        });
    }
}

export async function POST(
    req: Request
) {
    const body = await req.json();
    const { numberSolved, level, xp } = body;
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
                problems_solved: numberSolved,
                level: level,
                xp: xp
            }
        });
        return NextResponse.json(0);
    }
    
    await prismadb.user.update({
        where: {
            user_id: userId
        },
        data: {
            problems_solved: numberSolved,
            level: level,
            xp: xp
        }
    })
    return new NextResponse("", { status: 200 });
}