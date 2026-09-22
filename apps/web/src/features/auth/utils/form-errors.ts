import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ApiError } from '@/lib/api/api-error';

export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): string {
  if (!(error instanceof ApiError)) return 'Something went wrong. Please try again.';
  for (const [field, messages] of Object.entries(error.errors ?? {})) {
    setError(field as Path<T>, { type: 'server', message: messages[0] });
  }
  return error.message;
}
