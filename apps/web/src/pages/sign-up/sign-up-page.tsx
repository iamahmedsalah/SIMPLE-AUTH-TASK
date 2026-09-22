import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { signUpSchema, type SignUpInput } from '@fst/validation';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/forms/form-field';
import { PasswordRequirements } from '@/components/forms/password-requirements';
import { AuthCard } from '@/components/layout/auth-card';
import { AuthLayout } from '@/components/layout/auth-layout';
import { useSignUp } from '@/features/auth/hooks/auth-hooks';
import { applyServerErrors } from '@/features/auth/utils/form-errors';

export default function SignUpPage() {
  const mutation = useSignUp();
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailSent, setEmailSent] = useState(true);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const submit = handleSubmit(async (values) => {
    setFormError('');
    try {
      const result = await mutation.mutateAsync(values);
      setSuccess(result.message);
      setEmailSent(result.emailSent);
      setSubmittedEmail(values.email);
    } catch (error) {
      setFormError(applyServerErrors(error, setError));
    }
  });

  return (
    <AuthLayout>
      <AuthCard
        title="Create your account"
        description="A secure home for the work that matters."
        footer={
          <>
            Already have an account?{' '}
            <Link className="font-semibold text-primary hover:underline" to="/sign-in">
              Sign in
            </Link>
          </>
        }
      >
        {success ? (
          <div className="space-y-5">
            {emailSent ? (
              <div
                role="status"
                className="rounded-lg border border-primary/25 bg-primary/10 p-4 text-sm leading-6 text-primary"
              >
                {success}
              </div>
            ) : (
              <Alert>{success}</Alert>
            )}
            <Button asChild className="w-full">
              <Link to="/sign-in" state={{ email: submittedEmail }}>
                Continue to sign in
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={(event) => void submit(event)} className="space-y-5" noValidate>
            {formError ? <Alert>{formError}</Alert> : null}
            <FormField
              id="name"
              label="Name"
              autoComplete="name"
              placeholder="Ahmed Salah"
              error={errors.name?.message}
              {...register('name')}
            />
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
            <FormField
              id="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <PasswordRequirements value={watch('password')} />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
