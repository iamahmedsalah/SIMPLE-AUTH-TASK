import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@fst/validation';
import { FormField } from '@/components/forms/form-field';
import { AuthCard } from '@/components/layout/auth-card';
import { AuthLayout } from '@/components/layout/auth-layout';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useForgotPassword } from '@/features/auth/hooks/auth-hooks';
import { applyServerErrors } from '@/features/auth/utils/form-errors';

export default function ForgotPasswordPage() {
  const mutation = useForgotPassword();
  const [message, setMessage] = useState('');
  const [error, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
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
        title="Reset your password"
        description="Enter your email and we’ll send a secure, one-time reset link."
        footer={
          <Link
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            to="/sign-in"
          >
            <ArrowLeft className="size-3" /> Back to sign in
          </Link>
        }
      >
        {message ? (
          <div
            role="status"
            className="rounded-lg border border-primary/25 bg-primary/10 p-4 text-sm leading-6 text-primary"
          >
            {message}
          </div>
        ) : (
          <form onSubmit={(event) => void submit(event)} className="space-y-5" noValidate>
            {error ? <Alert>{error}</Alert> : null}
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
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Sending…
                </>
              ) : (
                'Send reset link'
              )}
            </Button>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
