/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> } // params artık bir Promise
) {
  // 1. Params'ı await ile açıyoruz
  const { username } = await params;

  if (!username) {
    return NextResponse.json({ error: "No username provided" }, { status: 400 });
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)
      .then((res) => res[0]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}