import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { PageLoader } from '@/components/feedback/page-loader';
import { useCurrentUser } from '@/features/auth/hooks/auth-hooks';

export function RequireAuth() {
  const { data: user, isLoading, isError } = useCurrentUser();
  const location = useLocation();
  if (isLoading) return <PageLoader />;
  if (!user || isError)
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export function PublicOnly() {
  const { data: user, isLoading } = useCurrentUser();
  if (isLoading) return <PageLoader />;
  if (user) return <Navigate to="/app" replace />;
  return <Outlet />;
}
