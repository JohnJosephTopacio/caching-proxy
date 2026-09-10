import { InvalidArgumentError } from 'commander';
import { describe, expect, it } from 'vitest';

import { validatePort, validateOrigin } from '../../src/cli/validation.js';

describe('validatePort', () => {
  it.each([
    ['1', 1],
    ['2805', 2805],
    ['65535', 65535],
  ])('converts a valid port %s to %i', (input, expected) => {
    expect(validatePort(input)).toBe(expected);
  });

  it.each(['0', '65536', '99999', '-5', '123abc', '9000.0', '802.32', 'xyz', '', ' '])(
    'throws invalidArgument on invalid port %s',
    (input) => {
      expect(() => validatePort(input)).toThrow(InvalidArgumentError);
    },
  );
});

describe('validateOrigin', () => {
  it.each([
    'https://validorigin.com',
    'http://localhost:5000',
    'http://127.0.0.1:9000',
    'https://api.example.com/resource',
  ])('returns a URL for valid origin %s', (input) => {
    const result = validateOrigin(input);
    expect(result.href).toEqual(new URL(input).href);
  });

  it.each([
    'invaliorigin.com',
    'some-string//',
    'file://secret.txt',
    'ftp://files.com',
    'https://user:password@example.com',
    'https://example.com/profiles?user=jdoe',
    'https://hobbyhub.com/feed#post',
  ])('throws invalidArgument on invalid origin %s', (input) => {
    expect(() => validateOrigin(input)).toThrow(InvalidArgumentError);
  });
});
