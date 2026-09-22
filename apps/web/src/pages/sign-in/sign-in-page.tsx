import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signInSchema, type SignInInput } from '@fst/validation';
import { FormField } from '@/components/forms/form-field';
import { AuthCard } from '@/components/layout/auth-card';
import { AuthLayout } from '@/components/layout/auth-layout';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useResendVerification, useSignIn } from '@/features/auth/hooks/auth-hooks';
import { applyServerErrors } from '@/features/auth/utils/form-errors';
import { ApiError } from '@/lib/api/api-error';

export default function SignInPage() {
  const signIn = useSignIn();
  const resend = useResendVerification();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const initialEmail = (location.state as { email?: string } | null)?.email ?? '';
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: initialEmail, password: '' },
  });
  const destination = (location.state as { from?: string } | null)?.from ?? '/app';

  const submit = handleSubmit(async (values) => {
    setFormError('');
    setNeedsVerification(false);
    try {
      await signIn.mutateAsync(values);
      await navigate(destination, { replace: true });
    } catch (error) {
      setNeedsVerification(error instanceof ApiError && error.code === 'EMAIL_NOT_VERIFIED');
      setFormError(applyServerErrors(error, setError));
    }
  });

  const resendEmail = async () => {
    try {
      const result = await resend.mutateAsync({ email: getValues('email') });
      setFormError(result.message);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to resend email.');
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        description="Sign in to continue to your workspace."
        footer={
          <>
            New to Northstar?{' '}
            <Link className="font-semibold text-primary hover:underline" to="/sign-up">
              Create an account
            </Link>
          </>
        }
      >
        <form onSubmit={(event) => void submit(event)} className="space-y-5" noValidate>
          {formError ? (
            <Alert>
              {formError}
              {needsVerification ? (
                <button
                  type="button"
                  className="ml-1 font-semibold underline"
                  onClick={() => void resendEmail()}
                  disabled={resend.isPending}
                >
                  Resend verification
                </button>
              ) : null}
            </Alert>
          ) : null}
          <FormField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <div className="space-y-2">
            <div className="flex items-center justify-end">
              <Link
                className="text-xs font-semibold text-primary hover:underline"
                to="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
            <FormField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
