import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import { createProxyHandler } from '../proxy/proxy-handler.js';

export function createApp(origin: URL): Express {
  const app = express();

  app.use(createProxyHandler(origin));

  app.use((error: unknown, request: Request, response: Response, _next: NextFunction) => {
    console.error(error);

    response.status(502).json({
      error: 'The origin server could not be reached',
    });
  });

  return app;
}
