import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { buildTargetUrl } from './build-target-url.js';

const EXCLUDED_RESPONSE_HEADERS = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'keep-alive',
  'transfer-encoding',
]);

export function createProxyHandler(origin: URL): RequestHandler {
  return async function (request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const targetUrl = buildTargetUrl(origin, request.originalUrl);

      const originResponse = await fetch(targetUrl, {
        method: request.method,
      });

      response.status(originResponse.status);

      originResponse.headers.forEach((value, name) => {
        if (!EXCLUDED_RESPONSE_HEADERS.has(name)) {
          response.setHeader(name, value);
        }
      });

      const responseBody = await originResponse.arrayBuffer();

      // .from is the supported method to instantiate a node buffer
      response.send(Buffer.from(responseBody));
    } catch (error) {
      next(error);
    }
  };
}
