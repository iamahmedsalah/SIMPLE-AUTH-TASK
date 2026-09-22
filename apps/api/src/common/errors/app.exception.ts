import { HttpException, type HttpStatus } from '@nestjs/common';

export interface ErrorDetails {
  [field: string]: string[];
}

export class AppException extends HttpException {
  constructor(
    public readonly code: string,
    message: string,
    status: HttpStatus,
    public readonly errors?: ErrorDetails,
  ) {
    super({ statusCode: status, code, message, ...(errors ? { errors } : {}) }, status);
  }
}
