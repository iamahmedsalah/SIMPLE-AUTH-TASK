import { Link } from 'react-router-dom';
import { AuthCard } from '@/components/layout/auth-card';
import { AuthLayout } from '@/components/layout/auth-layout';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Page not found"
        description="The page you’re looking for doesn’t exist or has moved."
      >
        <Button asChild className="w-full">
          <Link to="/">Go home</Link>
        </Button>
      </AuthCard>
    </AuthLayout>
  );
}
