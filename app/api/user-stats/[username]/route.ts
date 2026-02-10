/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { scores, users } from "@/lib/db/schema";
import { eq, desc, avg, max } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server"; // NextRequest ekledik

// Params'ı Promise olarak tanımlıyoruz (Next.js 15+ standardı)
export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ username: string }> } 
) {
    // KRİTİK NOKTA: params'ı önce await ediyoruz
    const resolvedParams = await params;
    const username = resolvedParams.username;

    try {
        const userResult = await db.select().from(users).where(eq(users.username, username)).limit(1);
        const user = userResult[0];

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const history = await db
            .select({ score: scores.score, createdAt: scores.createdAt })
            .from(scores)
            .where(eq(scores.userId, user.id))
            .orderBy(desc(scores.createdAt))
            .limit(10);

        const statsResult = await db
            .select({
                avgWpm: avg(scores.wpm),
                maxScore: max(scores.score),
            })
            .from(scores)
            .where(eq(scores.userId, user.id));

        return NextResponse.json({
            history: history.reverse(),
            stats: statsResult[0]
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}