import type { Request } from 'express';

export async function readRequestBody(request: Request): Promise<ArrayBuffer | undefined> {
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

  // Buffer's .buffer type doesn't match what fetch requires and might return the complete allocation besides those visible through concatenation
  // .from creates a new Uint8Array view only from visible bytes, and .buffer returns an ArrayBuffer type which matches fetch
  return Uint8Array.from(Buffer.concat(chunks)).buffer;
}
