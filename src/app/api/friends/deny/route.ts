import { z, ZodError } from "zod";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id: idToRemove } = z.object({ id: z.string() }).parse(body);
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await db.srem(
      `user:${session.user.id}:incoming_friend_requests`,
      idToRemove,
    );
    return NextResponse.json(
      { message: "Friend Request Removed" },
      { status: 201 },
    );
  } catch (e) {
    if (e instanceof ZodError)
      return NextResponse.json(
        { message: "Email is not valid" },
        { status: 422 },
      );

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
