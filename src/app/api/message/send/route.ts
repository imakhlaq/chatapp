import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NextResponse } from "next/server";
import { fetchRedis } from "@/helper/redis";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";
import { Message } from "@/lib/validations/messge";
import { ZodError } from "zod";
import { linkGc } from "next/dist/client/app-link-gc";

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    console.log({ text, chatId });

    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const [userId1, userId2] = chatId.split("--");
    console.log(`here ${21}`);
    if (session.user.id !== userId1 && session.user.id !== userId2)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const friendId = session.user.id === userId1 ? userId2 : userId1;
    console.log(`here ${26}`);
    //checking if they are friends
    const friendList = (await fetchRedis(
      "smembers",
      `user:${session.user.id}:friends`,
    )) as string[];

    const isFriend = friendList.includes(friendId);
    console.log(`here ${34}`);
    if (!isFriend)
      return NextResponse.json(
        { message: "You too are not friends" },
        { status: 401 },
      );
    console.log(`here ${40}`);
    //get sender data
    const rawSender: string = await fetchRedis(
      "get",
      `user:${session.user.id}`,
    );

    const sender: User = JSON.parse(rawSender);

    //send the message
    console.log(`here ${50}`);
    const timestamp = Date.now();

    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };

    console.log(`here ${60}`);

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(messageData),
    });

    console.log(`here ${67}`);
    return NextResponse.json({ message: text }, { status: 201 });
  } catch (e) {
    // @ts-ignore
    console.log(e.message);
    if (e instanceof ZodError)
      return NextResponse.json(
        { message: "Message is not in correct format" },
        { status: 401 },
      );

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
