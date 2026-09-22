export interface ApiErrorBody {
  statusCode: number;
  code: string;
  message: string;
  errors?: Record<string, string[]>;
  requestId?: string;
}

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly errors?: Record<string, string[]>;
  readonly requestId?: string;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.statusCode = body.statusCode;
    this.code = body.code;
    this.errors = body.errors;
    this.requestId = body.requestId;
  }
}
