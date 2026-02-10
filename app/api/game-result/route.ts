/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scores, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, score, difficulty } = body;

    // 1. Basit doğrulama
    if (!username || score === undefined) {
      return NextResponse.json({ ok: false, message: "Eksik veri" }, { status: 400 });
    }

    // 2. Önce bu username'e sahip kullanıcıyı bulup ID'sini alıyoruz
    // Çünkü 'scores' tablosu username değil, UUID olan userId bekliyor.
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    const user = userResult[0];

    if (!user) {
      return NextResponse.json({ ok: false, message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // 3. Veritabanına kayıt
    // Şemanda 'difficulty' kolonu yok, o yüzden bunu 'mode' kolonuna kaydediyoruz.
    await db.insert(scores).values({
      userId: user.id,      // UUID (DB'nin istediği asıl şey bu)
      score: score,         // Integer
      mode: difficulty,     // easy, medium, hard, ultra
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("DB Error:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}