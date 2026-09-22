import { ApiError, type ApiErrorBody } from './api-error';

const API_BASE_URL = '/api/v1';

export async function apiClient<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: { 'content-type': 'application/json', ...options.headers },
    });
  } catch {
    throw new ApiError({
      statusCode: 0,
      code: 'NETWORK_ERROR',
      message: 'Unable to reach the server. Check your connection and try again.',
    });
  }

  const body = (await response.json().catch(() => null)) as T | ApiErrorBody | null;
  if (!response.ok) {
    const fallback: ApiErrorBody = {
      statusCode: response.status,
      code: response.status === 429 ? 'RATE_LIMITED' : 'REQUEST_ERROR',
      message:
        response.status === 429 ? 'Too many attempts. Try again later.' : 'The request failed.',
    };
    throw new ApiError(isApiErrorBody(body) ? body : fallback);
  }
  return body as T;
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return Boolean(
    value &&
    typeof value === 'object' &&
    'statusCode' in value &&
    'code' in value &&
    'message' in value,
  );
}
