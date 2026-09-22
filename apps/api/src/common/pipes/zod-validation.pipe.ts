import { BadRequestException, Injectable, type PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: unknown): unknown {
    const result = this.schema.safeParse(value);
    if (result.success) return result.data;

    const errors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join('.') || 'form';
      errors[field] = [...(errors[field] ?? []), issue.message];
    }
    throw new BadRequestException({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors,
    });
  }
}
