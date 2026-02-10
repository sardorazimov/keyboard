/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { scores, users } from "@/lib/db/schema";
import { eq, desc, avg, max } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { username: string } }) {
    const { username } = params;

    try {
        // 1. Kullanıcıyı bul
        const userResult = await db.select().from(users).where(eq(users.username, username)).limit(1);
        const user = userResult[0];

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // 2. Son 10 oyun (Grafik için)
        const history = await db
            .select({ score: scores.score, createdAt: scores.createdAt })
            .from(scores)
            .where(eq(scores.userId, user.id))
            .orderBy(desc(scores.createdAt))
            .limit(10);

        // 3. Genel İstatistikler
        const statsResult = await db
            .select({
                avgWpm: avg(scores.wpm),
                maxScore: max(scores.score),
            })
            .from(scores)
            .where(eq(scores.userId, user.id));

        return NextResponse.json({
            history: history.reverse(), // Zaman akışı için çevir
            stats: statsResult[0]
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}