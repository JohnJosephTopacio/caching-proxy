import type { Request } from 'express';

export async function readRequestBody(request: Request) {
  if (request.method === 'GET' || request.method === 'HEAD') {
    return undefined;
  }

  const chunks: Buffer[] = [];

  // request is a Stream object, which is iterable
  for await (const chunk of request) {
    // chunks could be a string or other types so convert non-Buffer objects back to Buffer
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return undefined;
  }

  // just a Buffer can work here, but Uint8Array makes the returned data more universal
  return new Uint8Array(Buffer.concat(chunks));
}
