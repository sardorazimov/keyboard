import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scores, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { username, wpm, accuracy, errors } = await req.json();

  if (!username) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user.length) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  await db.insert(scores).values({
    userId: user[0].id,
    mode: "typing",
    score: wpm,
    wpm,
    accuracy,
  });

  return NextResponse.json({ ok: true });
}
