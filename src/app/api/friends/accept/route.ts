import { z, ZodError } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NextResponse } from "next/server";
import { fetchRedis } from "@/helper/redis";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    //check whether thy are already friends
    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd,
    );
    console.log("22");
    if (isAlreadyFriends)
      return NextResponse.json({ message: "Already Friends" }, { status: 404 });

    //checking if user has a friend request from this user
    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd,
    );

    if (!hasFriendRequest)
      return NextResponse.json(
        { message: "No friend Request" },
        { status: 400 },
      );
    //now both are friend
    await db.sadd(`user:${session.user.id}:friends`, idToAdd);
    await db.sadd(`user:${idToAdd}:friends`, session.user.id);

    // await db.srem(`user:${idToAdd}:incoming_friend_requests`,session.user.id)

    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (e) {
    if (e instanceof ZodError)
      return NextResponse.json(
        { message: "Email is not valid" },
        { status: 422 },
      );

    return NextResponse.json(
      // @ts-ignore
      { message: e.message ?? "Server Error" },
      { status: 500 },
    );
  }
}
