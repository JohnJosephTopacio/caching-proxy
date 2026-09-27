import type { Request } from 'express';

export async function readRequestBody(
  request: Request,
): Promise<Uint8Array<ArrayBuffer> | undefined> {
  if (request.method === 'GET' || request.method === 'HEAD') {
    return undefined;
  }

  const chunks: Buffer[] = [];

  // Request is built on top of http.IncomingMessage, so it naturally emits chunks as a Buffer object or strings
  for await (const chunk of request) {
    // convert non-Buffer object chunks to Buffer
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return undefined;
  }

  return new Uint8Array(Buffer.concat(chunks));
}
