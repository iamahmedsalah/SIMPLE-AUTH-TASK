import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { resetPasswordSchema, type ResetPasswordInput } from '@fst/validation';
import { FormField } from '@/components/forms/form-field';
import { PasswordRequirements } from '@/components/forms/password-requirements';
import { AuthCard } from '@/components/layout/auth-card';
import { AuthLayout } from '@/components/layout/auth-layout';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useResetPassword } from '@/features/auth/hooks/auth-hooks';
import { applyServerErrors } from '@/features/auth/utils/form-errors';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const mutation = useResetPassword();
  const [message, setMessage] = useState('');
  const [error, setFormError] = useState(
    token ? '' : 'This reset link is incomplete. Request a new one.',
  );
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, newPassword: '' },
  });
  const submit = handleSubmit(async (values) => {
    setFormError('');
    try {
      setMessage((await mutation.mutateAsync(values)).message);
    } catch (cause) {
      setFormError(applyServerErrors(cause, setError));
    }
  });
  return (
    <AuthLayout>
      <AuthCard
        title="Choose a new password"
        description="Use a strong password you haven’t used for this account before."
        footer={
          <Link className="font-semibold text-primary hover:underline" to="/sign-in">
            Return to sign in
          </Link>
        }
      >
        {message ? (
          <div className="space-y-5">
            <div
              role="status"
              className="rounded-lg border border-primary/25 bg-primary/10 p-4 text-sm text-primary"
            >
              {message}
            </div>
            <Button asChild className="w-full">
              <Link to="/sign-in">Sign in</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={(event) => void submit(event)} className="space-y-5" noValidate>
            {error ? <Alert>{error}</Alert> : null}
            <input type="hidden" {...register('token')} />
            <FormField
              id="newPassword"
              label="New password"
              type="password"
              autoComplete="new-password"
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
            <PasswordRequirements value={watch('newPassword')} />
            <Button className="w-full" type="submit" disabled={isSubmitting || !token}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Resetting…
                </>
              ) : (
                'Reset password'
              )}
            </Button>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
