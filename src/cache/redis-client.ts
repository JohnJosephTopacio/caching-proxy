import { createClient } from 'redis';

export function createRedisClient(url: string) {
  const client = createClient({ url });

  client.on('error', (error: unknown) => {
    console.error('Redis client error', error);
  });

  return client;
}

export type RedisClient = ReturnType<typeof createRedisClient>;
