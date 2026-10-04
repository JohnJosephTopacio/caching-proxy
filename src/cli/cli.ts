import { Command } from 'commander';
import { validateOrigin, validatePort } from './validation.js';
import { startServer } from '../server/start-server.js';
import { connectRedis } from '../cache/connect-redis.js';
import { getRedisUrl } from '../config/redis.js';

export interface StartOptions {
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
    .action(async (options: StartOptions) => {
      const redisClient = await connectRedis(getRedisUrl());

      console.log(`Redis connection ready: ${redisClient.isReady}`);

      const server = startServer(options);

      let shutdownStarted = false;

      async function shutdown(signal: string): Promise<void> {
        if (shutdownStarted) {
          return;
        }

        shutdownStarted = true;
        console.log(`\nReceived ${signal}. Shutting down...`);

        try {
          await new Promise<void>((resolve, reject) => {
            server.close((error) => {
              if (error) {
                reject(error);
                return;
              }

              resolve();
            });
          });
        } catch (error) {
          console.error('Graceful shutdown failed:', error);
          process.exitCode = 1;
        }
      }

      process.once('SIGINT', () => {
        void shutdown('SIGINT');
      });

      process.once('SIGTERM', () => {
        void shutdown('SIGTERM');
      });
    });

  program
    .command('clear-cache')
    .description('Clears the cache - this command is not implemented yet');

  return program;
}

export default createProgram;
