import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scores, users } from "@/lib/db/schema";
import { desc, eq, and, SQL } from "drizzle-orm"; // 'and' ve 'SQL' ekledik

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");

  // 1. Filtreleri bir dizide toplayalım
  const filters: (SQL | undefined)[] = [
    eq(scores.mode, "typing") // Varsayılan filtremiz
  ];

  // 2. Eğer country varsa filtreye ekleyelim
  if (country) {
    filters.push(eq(users.country, country));
  }

  // 3. Sorguyu tek seferde inşa edelim
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
    .where(and(...filters)) // Tüm filtreleri 'and' ile birleştiriyoruz
    .orderBy(desc(scores.wpm))
    .limit(10);

  return NextResponse.json(data);
}