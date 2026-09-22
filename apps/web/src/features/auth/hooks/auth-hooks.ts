import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  forgotPassword,
  getCurrentUser,
  logout,
  resendVerification,
  resetPassword,
  signIn,
  signUp,
  verifyEmail,
} from '../api/auth-api';

export const authKeys = { currentUser: ['auth', 'current-user'] as const };

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: getCurrentUser,
    staleTime: 60_000,
    retry: false,
  });
}

export const useSignUp = () => useMutation({ mutationFn: signUp });

export function useSignIn() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: signIn,
    onSuccess: ({ user }) => client.setQueryData(authKeys.currentUser, user),
  });
}

export function useLogout() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      client.setQueryData(authKeys.currentUser, null);
      void client.invalidateQueries({ queryKey: authKeys.currentUser });
    },
  });
}

export const useVerifyEmail = () => useMutation({ mutationFn: verifyEmail });
export const useResendVerification = () => useMutation({ mutationFn: resendVerification });
export const useForgotPassword = () => useMutation({ mutationFn: forgotPassword });
export const useResetPassword = () => useMutation({ mutationFn: resetPassword });
