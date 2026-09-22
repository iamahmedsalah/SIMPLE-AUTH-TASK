import { randomUUID } from 'node:crypto';
import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: (error?: unknown) => void): void {
    const incomingHeader = request.headers['x-request-id'];
    const incoming = Array.isArray(incomingHeader) ? incomingHeader[0] : incomingHeader;
    const requestId = typeof incoming === 'string' && incoming.length <= 128 ? incoming : randomUUID();
    response.setHeader('x-request-id', requestId);
    next();
  }
}
