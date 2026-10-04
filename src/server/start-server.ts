import type { Server } from 'node:http';
import { createApp } from './create-app.js';

export interface StartOptions {
  port: number;
  origin: URL;
}

export function startServer({ origin, port }: StartOptions): Server {
  const app = createApp(origin);

  return app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
    console.log(`Forwarding requests to ${origin}`);
  });
}
