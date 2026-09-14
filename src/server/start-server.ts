import type { StartOptions } from '../cli/cli.js';
import type { Server } from 'node:http';
import { createApp } from './create-app.js';

export function startServer({ origin, port }: StartOptions): Server {
  const app = createApp(origin);

  return app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
    console.log(`Forwarding requests to ${origin}`);
  });
}
