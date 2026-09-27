import { describe, expect, it } from 'vitest';

import { buildTargetUrl } from '../../src/proxy/build-target-url.js';

describe('buildTargetUrl', () => {
  it('appends the incoming path to the origin', () => {
    const result = buildTargetUrl(new URL('https://example.com'), '/products/1');

    expect(result.href).toBe('https://example.com/products/1');
  });

  it('preserves the incoming query string', () => {
    const result = buildTargetUrl(new URL('https://example.com'), '/products?limit=5&skip=10');

    expect(result.href).toBe('https://example.com/products?limit=5&skip=10');
  });

  it('preserves an origin path prefix', () => {
    const result = buildTargetUrl(new URL('https://example.com/api/v1'), '/products');

    expect(result.href).toBe('https://example.com/api/v1/products');
  });

  it('avoids duplicate slashes', () => {
    const result = buildTargetUrl(new URL('https://example.com/api/'), '/products');

    expect(result.href).toBe('https://example.com/api/products');
  });

  it('does not mutate the provided origin URL', () => {
    const origin = new URL('https://example.com/api');

    buildTargetUrl(origin, '/products');

    expect(origin.href).toBe('https://example.com/api');
  });
});
