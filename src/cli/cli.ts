import { Command } from 'commander';
import { validateOrigin, validatePort } from './validation.js';

interface StartOptions {
  port: number;
  origin: URL;
}

export function createProgram() {
  const program = new Command();

  program.name('caching-proxy').description('Start a caching proxy server.').version('1.0.0');

  program
    .command('start')
    .description('Start the caching proxy server with a port and origin.')
    .requiredOption(
      '-p, --port <port>',
      'The port number on which the proxy server will listen',
      validatePort,
    )
    .requiredOption(
      '-o, --origin <url>',
      'The destination server URL to proxy requests to',
      validateOrigin,
    )
    .action((options: StartOptions) => {
      console.log(`port: ${options.port}`);
      console.log(`origin: ${options.origin}`);
    });

  program
    .command('clear-cache')
    .description('Clears the cache - this command is not implemented yet');

  return program;
}

export default createProgram;
