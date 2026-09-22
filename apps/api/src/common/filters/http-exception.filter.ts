import type { ServerResponse } from 'node:http';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

interface KnownErrorBody {
  statusCode?: number;
  code?: string;
  message?: string | string[];
  errors?: Record<string, string[]>;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    const isHttp = exception instanceof HttpException;
    const statusCode = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const raw = isHttp ? exception.getResponse() : undefined;
    const body: KnownErrorBody = typeof raw === 'object' && raw !== null ? raw : {};
    const serverResponse = response as unknown as ServerResponse;
    const header =
      typeof serverResponse.getHeader === 'function'
        ? serverResponse.getHeader('x-request-id')
        : undefined;
    const requestId = typeof header === 'string' ? header : undefined;

    if (!isHttp || statusCode >= 500) {
      this.logger.error(
        { err: exception, requestId, method: request.method, path: request.originalUrl ?? request.url },
        'Unexpected request failure',
      );
    }

    const rawMessage = body.message;
    const message =
      statusCode >= 500
        ? 'An unexpected error occurred'
        : Array.isArray(rawMessage)
          ? rawMessage.join(', ')
          : (rawMessage ?? (typeof raw === 'string' ? raw : 'Request failed'));

    response.status(statusCode).json({
      statusCode,
      code: body.code ?? this.defaultCode(statusCode),
      message,
      ...(body.errors ? { errors: body.errors } : {}),
      ...(requestId ? { requestId } : {}),
    });
  }

  private defaultCode(status: number): string {
    if (status === 401) return 'UNAUTHORIZED';
    if (status === 404) return 'NOT_FOUND';
    if (status === 429) return 'RATE_LIMITED';
    return status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR';
  }
}
