import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { PageLoader } from '@/components/feedback/page-loader';
import { RouteErrorPage } from '@/components/feedback/route-error-page';
import { PublicOnly, RequireAuth } from './route-guards';

const SignInPage = lazy(() => import('@/pages/sign-in/sign-in-page'));
const SignUpPage = lazy(() => import('@/pages/sign-up/sign-up-page'));
const ForgotPasswordPage = lazy(() => import('@/pages/forgot-password/forgot-password-page'));
const ResetPasswordPage = lazy(() => import('@/pages/reset-password/reset-password-page'));
const VerifyEmailPage = lazy(() => import('@/pages/verify-email/verify-email-page'));
const ApplicationPage = lazy(() => import('@/pages/application/application-page'));
const NotFoundPage = lazy(() => import('@/pages/not-found/not-found-page'));

const suspense = (element: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/app" replace /> },
      {
        element: <PublicOnly />,
        children: [
          { path: 'sign-in', element: suspense(<SignInPage />) },
          { path: 'sign-up', element: suspense(<SignUpPage />) },
          { path: 'forgot-password', element: suspense(<ForgotPasswordPage />) },
        ],
      },
      { path: 'reset-password', element: suspense(<ResetPasswordPage />) },
      { path: 'verify-email', element: suspense(<VerifyEmailPage />) },
      {
        element: <RequireAuth />,
        children: [{ path: 'app', element: suspense(<ApplicationPage />) }],
      },
      { path: '*', element: suspense(<NotFoundPage />) },
    ],
  },
]);
