const upStashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const upStashAuthToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Commands = "zrange" | "sismember" | "get" | "smembers";

export async function fetchRedis(
  command: Commands,
  ...args: (string | number)[]
) {
  const commandURL = `${upStashRedisRestUrl}/${command}/${args.join("/")}`;
  const res = await fetch(`${commandURL}`, {
    headers: {
      Authorization: `Bearer ${upStashAuthToken}`,
    },
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(`Error executing Redis command: ${res.statusText}`);

  const data = await res.json();
  return data.result;
}
