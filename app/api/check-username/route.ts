import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";
import { db } from "../../../lib/db";
import { users } from "../../../lib/db/schema";

export async function POST(req: Request) {
  const { username } = await req.json();

  if (!username || username.length < 3) {
    return NextResponse.json(
      { ok: false, message: "Invalid username" },
      { status: 400 }
    );
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ ok: false, taken: true });
  }

  return NextResponse.json({ ok: true, taken: false });
}
