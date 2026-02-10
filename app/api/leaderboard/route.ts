import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scores, users } from "@/lib/db/schema";
import { desc, eq, and, SQL } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");
  // Yeni: query'den mod tipini alıyoruz (typing veya game)
  const type = searchParams.get("type") || "typing"; 

  const filters: (SQL | undefined)[] = [
    eq(scores.mode, type) // Artık sabit değil, gelen tipe göre filtreleniyor
  ];

  if (country) {
    filters.push(eq(users.country, country));
  }

  const data = await db
    .select({
      username: users.username,
      country: users.country,
      wpm: scores.wpm,
      accuracy: scores.accuracy,
      createdAt: scores.createdAt,
    })
    .from(scores)
    .innerJoin(users, eq(users.id, scores.userId))
    .where(and(...filters))
    .orderBy(desc(scores.wpm))
    .limit(10);

  return NextResponse.json(data);
}