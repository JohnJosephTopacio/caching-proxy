import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';

import express, { type Express } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createApp } from '../../src/server/create-app.js';

describe('proxy forwarding', () => {
  let originServer: Server;
  let proxyApp: Express;

  beforeAll(async () => {
    // create the mock origin server
    const originApp = express();

    originApp.use(express.json());
    originApp.use(express.text());

    originApp.get('/inspect', (request, response) => {
      response
        .status(201)
        .set('X-Origin-Test', 'forwarded')
        .json({
          query: request.query,
          accept: request.get('accept'),
        });
    });

    originApp.post('/products', (request, response) => {
      response.status(201).json({
        receivedBody: request.body,
        receivedContentType: request.get('content-type'),
      });
    });

    originApp.get('/plain-text', (_request, response) => {
      response.status(200).type('text/plain').send('Hello from the origin');
    });

    originApp.get('/error', (_request, response) => {
      response.status(500).json({
        error: 'Unexpected Error',
      });
    });

    // wait for server to be ready
    await new Promise<void>((resolve, reject) => {
      originServer = originApp.listen(0, '127.0.0.1');

      originServer.once('listening', resolve);
      originServer.once('error', reject);
    });

    const address = originServer.address();

    if (address === null || typeof address === 'string') {
      throw new Error('Expected the origin server to use a TCP address');
    }

    const { port } = address as AddressInfo;
    const origin = new URL(`http://127.0.0.1:${port}`);

    proxyApp = createApp(origin);
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      originServer.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  });

  it('forwards the path, query string, headers, and status', async () => {
    const response = await request(proxyApp)
      .get('/inspect?limit=5')
      .set('Accept', 'application/json')
      .expect(201);

    expect(response.headers['x-origin-test']).toBe('forwarded');

    expect(response.body).toEqual({
      query: {
        limit: '5',
      },
      accept: 'application/json',
    });
  });

  it('forwards a JSON request body', async () => {
    const response = await request(proxyApp)
      .post('/products')
      .set('Content-Type', 'application/json')
      .send({
        title: 'Proxy Test',
      })
      .expect(201);

    expect(response.body).toEqual({
      receivedBody: {
        title: 'Proxy Test',
      },
      receivedContentType: 'application/json',
    });
  });

  it('forwards non-JSON responses', async () => {
    const response = await request(proxyApp).get('/plain-text').expect(200);

    expect(response.text).toBe('Hello from the origin');
    expect(response.headers['content-type']).toMatch(/^text\/plain/);
  });

  it('preserves unsuccessful origin status codes', async () => {
    const response = await request(proxyApp).get('/error').expect(500);

    expect(response.body).toEqual({
      error: 'Unexpected Error',
    });
  });
});
