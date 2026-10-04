import { createRedisClient, type RedisClient } from './redis-client.js';

export async function connectRedis(url: string): Promise<RedisClient> {
  const client = createRedisClient(url);

  await client.connect();

  const response = await client.ping();

  if (response !== 'PONG') {
    await client.close();
    throw new Error(`Redis health check returned an unexpected response: ${response}`);
  }

  return client;
}
