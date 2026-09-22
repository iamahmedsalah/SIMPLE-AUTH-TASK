import { describe, expect, it } from 'vitest';
import { passwordSchema, signUpSchema } from './index';

describe('shared validation', () => {
  it('enforces every password requirement', () => {
    for (const value of ['short1!', 'onlyletters!', '12345678!', 'Letters123']) {
      expect(passwordSchema.safeParse(value).success).toBe(false);
    }
    expect(passwordSchema.safeParse('Secure1!').success).toBe(true);
  });

  it('trims form values and rejects unknown properties', () => {
    const result = signUpSchema.safeParse({
      name: '  Ahmed  ',
      email: ' ahmed@example.com ',
      password: 'Secure1!',
    });
    expect(result.success && result.data.name).toBe('Ahmed');
    expect(
      signUpSchema.safeParse({ ...(result.success && result.data), role: 'admin' }).success,
    ).toBe(false);
  });
});
