import { describe, expect, it } from 'vitest';

import { getRedisUrl } from '../../src/config/redis.js';

describe('getRedisUrl', () => {
  it('returns the local Redis by default', () => {
    expect(getRedisUrl({})).toBe('redis://127.0.0.1:6379');
  });

  it('returns the configured Redis URL', () => {
    expect(
      getRedisUrl({
        REDIS_URL: 'redis://redis.example.com:6380',
      }),
    ).toBe('redis://redis.example.com:6380');
  });

  it('accepts a secure Redis URL', () => {
    expect(
      getRedisUrl({
        REDIS_URL: 'rediss://redis.example.com:6380',
      }),
    ).toBe('rediss://redis.example.com:6380');
  });

  it('rejects malformed URLs', () => {
    expect(() => {
      getRedisUrl({ REDIS_URL: 'not-a-valid-url' });
    }).toThrow(/valid URL/i);
  });

  it('rejects unsupported protocols', () => {
    expect(() => {
      getRedisUrl({ REDIS_URL: 'https://unsupported.com' });
    }).toThrow(/redis or rediss/i);
  });
});
