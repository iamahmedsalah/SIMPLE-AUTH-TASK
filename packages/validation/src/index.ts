import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const emailSchema = z.string().trim().email('Enter a valid email address').max(254);
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, 'Password must contain at least 8 characters')
  .max(128, 'Password must contain at most 128 characters')
  .regex(/[A-Za-z]/, 'Password must contain a letter')
  .regex(/\d/, 'Password must contain a number')
  .regex(/[^A-Za-z\d]/, 'Password must contain a special character');

export const signUpSchema = z.strictObject({
  name: z.string().trim().min(3, 'Name must contain at least 3 characters').max(80),
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.strictObject({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(128),
});

export const tokenSchema = z.string().min(32, 'Invalid token').max(256, 'Invalid token');
export const verifyEmailSchema = z.strictObject({ token: tokenSchema });
export const resendVerificationSchema = z.strictObject({ email: emailSchema });
export const forgotPasswordSchema = z.strictObject({ email: emailSchema });
export const resetPasswordSchema = z.strictObject({
  token: tokenSchema,
  newPassword: passwordSchema,
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
