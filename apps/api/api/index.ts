/**
 * Vercel Serverless Function entry point for the NestJS API.
 *
 * Vercel runs stateless, short-lived Node.js functions. To avoid creating a new
 * NestJS application on every cold start, the Express instance is cached in module
 * scope and reused across warm invocations in the same container.
 *
 * Key differences from main.ts:
 *  - Uses ExpressAdapter so we can access the raw Express app
 *  - Calls app.init() instead of app.listen() — Vercel handles the HTTP listener
 *  - Disables shutdown hooks (no SIGTERM in serverless)
 *  - Disables Swagger in production to reduce cold-start payload
 */
import 'reflect-metadata';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { type Express } from 'express';
import { createApp } from '../src/app.factory';

let cachedServer: Express | null = null;

async function getServer(): Promise<Express> {
  if (cachedServer) return cachedServer;

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const app = await createApp({
    httpAdapter: adapter,
    shutdownHooks: false,   // no SIGTERM in Vercel serverless
    swagger: false,         // skip Swagger in production to reduce cold-start time
  });

  await app.init();
  cachedServer = expressApp;
  return cachedServer;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const server = await getServer();
  server(req, res);
}
