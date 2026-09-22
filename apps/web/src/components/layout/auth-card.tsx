import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card className="w-full max-w-md p-6 sm:p-8">
      <div className="mb-7 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {children}
      {footer ? (
        <div className="mt-6 border-t pt-5 text-center text-sm text-muted-foreground">{footer}</div>
      ) : null}
    </Card>
  );
}
