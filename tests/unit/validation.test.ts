import { InvalidArgumentError } from 'commander';
import { describe, expect, it } from 'vitest';

import { validatePort, validateOrigin } from '../../src/cli/validation.js';

describe('validatePort', () => {
  it.each([
    ['1', 1],
    ['2805', 2805],
    ['65535', 65535],
  ])('Converts a valid port %s to %i', (input, expected) => {
    expect(validatePort(input)).toBe(expected);
  });

  it.each(['0', '65536', '99999', '-5', '123abc', '9000.0', '802.32', 'xyz', '', ' '])(
    'Throws invalidArgument on invalidPort (%s)',
    (input) => {
      expect(() => validatePort(input)).toThrow(InvalidArgumentError);
    },
  );
});
