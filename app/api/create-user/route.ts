import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function POST(req: Request) {
  const { username, country, language } = await req.json();

  if (!username || !country) {
    return NextResponse.json(
      { ok: false, message: "Eksik bilgi" },
      { status: 400 }
    );
  }

  await db.insert(users).values({
    username,
    country,
    language: language || "en",
  });

  return NextResponse.json({ ok: true });
}
