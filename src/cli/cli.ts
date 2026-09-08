import { Command } from 'commander';
const program = new Command();

program.name('caching-proxy').description('Start a caching proxy server.').version('1.0.0');

program
  .command('start')
  .description('Start the caching proxy server with a port and origin.')
  .requiredOption('--port, <PORT>', 'The port number on which the proxy server will listen')
  .requiredOption('--origin, <URL>', 'The destination server URL to proxy requests to')
  .action((options) => {
    console.log(options.port);
    console.log(options.origin);
  });

program
  .command('clear-cache')
  .description('Clears the cache - this command is not implemented yet');

program.parse();

export default program;
