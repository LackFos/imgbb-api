import { createClient } from "redis";

export type RedisClient = ReturnType<typeof createClient>;

const clientPromise: Promise<RedisClient> | null = null;

export function RedisClient(): Promise<RedisClient> {
  if (!clientPromise) {
    const client = createClient();

    client.on("error", (error: Error) => console.error("Redis Error:", error));

    return client.connect().then(() => client);
  }

  return clientPromise;
}
