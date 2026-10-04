const DEFAULT_REDIS_URL = 'redis://127.0.0.1:6379';

export function getRedisUrl(environment: NodeJS.ProcessEnv = process.env): string {
  const configuredUrl = environment.REDIS_URL?.trim();

  if (!configuredUrl) {
    return DEFAULT_REDIS_URL;
  }

  let redisUrl: URL;

  try {
    redisUrl = new URL(configuredUrl);
  } catch {
    throw new Error('REDIS_URL must be a valid URL');
  }

  if (redisUrl.protocol != 'redis:' && redisUrl.protocol !== 'rediss:') {
    throw new Error('REDIS_URL must use the redis or rediss protocol');
  }

  return redisUrl.href;
}
