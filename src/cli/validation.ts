import { InvalidArgumentError } from 'commander';

const PORT_PATTERN = /^\d+$/;

export function validatePort(port: string): number {
  // If the port given is not purely numbers
  if (!PORT_PATTERN.test(port)) {
    throw new InvalidArgumentError('Port must be a number from 1 - 65535');
  }

  const convertedPort = Number(port);

  return convertedPort;
}
