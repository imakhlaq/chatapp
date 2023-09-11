import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { notFound } from "next/navigation";
import { fetchRedis } from "@/helper/redis";
import FriendRequest from "@/components/FriendRequest";

type Props = {};

export default async function Page({}: Props) {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const incomingSenderIds = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`,
  )) as string[];
  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const senderJSON = (await fetchRedis(
        "get",
        `user:${senderId}`,
      )) as string;
      const sender = JSON.parse(senderJSON) as User;
      return {
        senderId,
        senderEmail: sender.email,
      };
    }),
  );

  return (
    <main className="pt-8">
      <h1 className="font-bold text-6xl mb-8">Add a Friend</h1>
      <div className="flex flex-col gap-4">
        <FriendRequest
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
}
