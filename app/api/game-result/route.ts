/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scores, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, score, difficulty } = body;

    if (!username || score === undefined) {
      return NextResponse.json({ ok: false, message: "Eksik veri" }, { status: 400 });
    }

    // 1. Kullanıcıyı bulup UUID'sini alıyoruz
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    const user = userResult[0];

    if (!user) {
      return NextResponse.json({ ok: false, message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // 2. Scores tablosuna kayıt
    // Şemandaki tüm notNull() alanları doldurduğumuzdan emin oluyoruz
    await db.insert(scores).values({
      userId: user.id,      // user_id kolonuna gider
      score: score,         // integer
      wpm: score,           // Leaderboard sıralaması için (skoru WPM gibi kullanıyoruz)
      mode: "game",         // Leaderboard'un filtreleyebilmesi için sabit "game"
      difficulty: difficulty, // easy, medium vb.
      accuracy: 100,        // Varsayılan
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("DB Error:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}