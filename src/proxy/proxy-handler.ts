import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { buildTargetUrl } from './build-target-url.js';
import { buildRequestHeaders } from './build-request-headers.js';
import { readRequestBody } from './read-request-body.js';

const EXCLUDED_RESPONSE_HEADERS = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'transfer-encoding',
  'trailer',
  'upgrade',
]);

export function createProxyHandler(origin: URL): RequestHandler {
  return async function (request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const targetUrl = buildTargetUrl(origin, request.originalUrl);
      const requestHeaders = buildRequestHeaders(request);
      const requestBody = await readRequestBody(request);

      const fetchOptions: RequestInit = {
        method: request.method,
        headers: requestHeaders,
        redirect: 'manual',
      };

      if (requestBody !== undefined) {
        fetchOptions.body = requestBody;
      }

      const originResponse = await fetch(targetUrl, fetchOptions);

      response.status(originResponse.status);

      originResponse.headers.forEach((value, name) => {
        if (!EXCLUDED_RESPONSE_HEADERS.has(name)) {
          response.setHeader(name, value);
        }
      });

      if (request.method === 'HEAD') {
        response.end();
        return;
      }

      // Wait for the entire raw body
      const responseBody = await originResponse.arrayBuffer();

      // Make sure body is reliably recognized as raw binary data by creating a Buffer view over it
      response.send(Buffer.from(responseBody));
    } catch (error) {
      next(error);
    }
  };
}
