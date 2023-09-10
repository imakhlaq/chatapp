import { addFriendValidator } from "@/lib/validations/validation";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { fetchRedis } from "@/helper/redis";
import { db } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    //checking if user is logged in
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    //fetching data using function because next cache the data in routes
    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`,
    )) as string;

    if (!idToAdd)
      return NextResponse.json(
        { message: "This person doesn't exits" },
        { status: 400 },
      );

    //you can't add yourself as a friend
    if (idToAdd === session.user.id)
      return NextResponse.json(
        { message: "you can't add yourself as a friend" },
        { status: 400 },
      );
    //check if it already friends req is sent
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id,
    )) as 0 | 1;

    if (isAlreadyAdded)
      return NextResponse.json({ message: "Already friend request is sent" });

    //check if it already a friends
    const isAlreadyFriend = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd,
    )) as 0 | 1;

    if (isAlreadyFriend)
      return NextResponse.json({ message: "Already a friend" });

    //valid now send friend request only get request is cached by Next.js
    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return NextResponse.json(
      { message: "Friend Request send" },
      { status: 201 },
    );
  } catch (e) {
    if (e instanceof z.ZodError)
      return NextResponse.json(
        { message: "Email is not valid" },
        { status: 422 },
      );

    return NextResponse.json({ message: "Server Error" }, { status: 422 });
  }
}
