import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET - fetch existing user
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, user.primaryEmailAddress?.emailAddress || ""));

    if (existingUser.length > 0) {
      return NextResponse.json(existingUser[0]);
    }
    return NextResponse.json(null);
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// POST - create new user
export async function POST() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress || "";

    // Check if already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json(existingUser[0]);
    }

    // Create new
    const [newUser] = await db
      .insert(usersTable)
      .values({
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email,
        credits: 100,
      })
      .returning();

    return NextResponse.json(newUser);
  } catch (err) {
    console.error("Error creating user:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
