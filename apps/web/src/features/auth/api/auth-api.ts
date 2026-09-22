import type {
  ForgotPasswordInput,
  ResendVerificationInput,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
  VerifyEmailInput,
} from '@fst/validation';
import { apiClient } from '@/lib/api/api-client';
import { ApiError } from '@/lib/api/api-error';
import type { MessageResponse, SignUpResponse, User, UserResponse } from '../types/auth';

const post = <T>(path: string, body?: unknown) =>
  apiClient<T>(path, {
    method: 'POST',
    body: body === undefined ? undefined : JSON.stringify(body),
  });

export const signUp = (input: SignUpInput) => post<SignUpResponse>('/auth/signup', input);
export const signIn = (input: SignInInput) => post<UserResponse>('/auth/signin', input);
export const logout = () => post<MessageResponse>('/auth/logout');
export const verifyEmail = (input: VerifyEmailInput) =>
  post<MessageResponse>('/auth/verify-email', input);
export const resendVerification = (input: ResendVerificationInput) =>
  post<MessageResponse>('/auth/resend-verification', input);
export const forgotPassword = (input: ForgotPasswordInput) =>
  post<MessageResponse>('/auth/forgot-password', input);
export const resetPassword = (input: ResetPasswordInput) =>
  post<MessageResponse>('/auth/reset-password', input);

export async function getCurrentUser(): Promise<User | null> {
  try {
    return (await apiClient<UserResponse>('/auth/me')).user;
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) return null;
    throw error;
  }
}
