import { fetchRedis } from "@/helper/redis";

export async function getFriendsByUserId(id: string) {
  const friendIds = (await fetchRedis(
    "smembers",
    `user:${id}:friends`,
  )) as string[];

  const friends = Promise.all(
    friendIds.map(async (id) => {
      const friend = await fetchRedis("get", `user:${id}`);
      return JSON.parse(friend) as User;
    }),
  );

  return friends;
}
