import { CircleCheck, CircleX, LoaderCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthCard } from '@/components/layout/auth-card';
import { AuthLayout } from '@/components/layout/auth-layout';
import { Button } from '@/components/ui/button';
import { useVerifyEmail } from '@/features/auth/hooks/auth-hooks';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const mutation = useVerifyEmail();
  const started = useRef(false);

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;
    mutation.mutate({ token });
  }, [token, mutation]);

  let content;
  if (!token || mutation.isError) {
    content = (
      <div className="space-y-5 text-center">
        <CircleX className="mx-auto size-12 text-destructive" />
        <p className="text-sm leading-6 text-muted-foreground">
          {!token
            ? 'This verification link is incomplete.'
            : (mutation.error?.message ?? 'This verification link is invalid or has expired.')}
        </p>
        <Button asChild className="w-full">
          <Link to="/sign-in">Return to sign in</Link>
        </Button>
      </div>
    );
  } else if (mutation.isSuccess) {
    content = (
      <div className="space-y-5 text-center">
        <CircleCheck className="mx-auto size-12 text-primary" />
        <p role="status" className="text-sm leading-6 text-muted-foreground">
          {mutation.data.message}
        </p>
        <Button asChild className="w-full">
          <Link to="/sign-in">Sign in</Link>
        </Button>
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col items-center gap-4 py-3" role="status">
        <LoaderCircle className="size-9 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Verifying your email…</p>
      </div>
    );
  }
  return (
    <AuthLayout>
      <AuthCard
        title="Email verification"
        description="We’re confirming your secure verification link."
      >
        {content}
      </AuthCard>
    </AuthLayout>
  );
}
