import { AlertTriangle, Home, RefreshCw, Sparkles } from 'lucide-react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FriendlyRouteError {
  title: string;
  description: string;
  details?: string;
}

export function RouteErrorPage() {
  const routeError = useRouteError();
  const error = describeRouteError(routeError);

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/.14),transparent_35%),radial-gradient(circle_at_bottom_right,hsl(var(--destructive)/.08),transparent_30%)]" />
      <Card className="relative w-full max-w-lg p-6 sm:p-8">
        <div className="mb-8 flex items-center gap-2 text-sm font-bold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          Northstar
        </div>

        <div className="space-y-6 text-center" role="alert" aria-live="assertive">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="size-7" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{error.title}</h1>
            <p className="text-sm leading-6 text-muted-foreground">{error.description}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="button" onClick={() => window.location.reload()}>
              <RefreshCw className="size-4" aria-hidden="true" />
              Try again
            </Button>
            <Button asChild variant="outline">
              <Link to="/sign-in">
                <Home className="size-4" aria-hidden="true" />
                Go to sign in
              </Link>
            </Button>
          </div>

          {import.meta.env.DEV && error.details ? (
            <details className="rounded-lg border bg-muted/50 text-left">
              <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">
                Developer details
              </summary>
              <pre className="max-h-48 overflow-auto border-t p-4 text-xs leading-5 text-muted-foreground">
                {error.details}
              </pre>
            </details>
          ) : null}

          <p className="border-t pt-5 text-sm leading-6 text-muted-foreground">
            If this keeps happening, restart the development server or contact support.
          </p>
        </div>
      </Card>
    </main>
  );
}

function describeRouteError(error: unknown): FriendlyRouteError {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        title: 'Page not found',
        description: 'The page you requested does not exist or may have moved.',
        details: `${error.status} ${error.statusText}`,
      };
    }
    return {
      title: 'We could not open this page',
      description: 'The server returned an unexpected response. Please try again.',
      details: `${error.status} ${error.statusText}`,
    };
  }

  if (error instanceof Error) {
    const moduleLoadFailure = /module|dynamically imported|loading chunk/i.test(error.message);
    return {
      title: moduleLoadFailure ? 'The page could not be loaded' : 'Something went wrong',
      description: moduleLoadFailure
        ? 'A required application file was unavailable. Refresh the page to load the latest version.'
        : 'An unexpected application error occurred. Your account data has not been changed.',
      details: error.stack ?? error.message,
    };
  }

  return {
    title: 'Something went wrong',
    description: 'An unexpected application error occurred. Please try again.',
  };
}
