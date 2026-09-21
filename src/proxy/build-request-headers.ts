import type { Request } from 'express';

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer_encoding',
  'upgrade',
]);

export function buildRequestHeaders(request: Request): Headers {
  const headers = new Headers();
  const excludedHeaders = new Set(HOP_BY_HOP_HEADERS);

  const connectionHeader = request.headers.connection;

  if (connectionHeader) {
    for (const name of connectionHeader.split(',')) {
      excludedHeaders.add(name.trim().toLowerCase());
    }
  }

  excludedHeaders.add('host');
  excludedHeaders.add('content-length');

  for (const [name, value] of Object.entries(request.headers)) {
    if (value === undefined || excludedHeaders.has(name)) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
      continue;
    }

    headers.set(name, value);
  }

  return headers;
}
