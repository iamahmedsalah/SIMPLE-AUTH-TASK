import type { ReactNode } from 'react';
import { Brand } from './brand';
import { ThemeToggle } from './theme-toggle';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/.14),transparent_35%),radial-gradient(circle_at_bottom_right,hsl(var(--primary)/.09),transparent_30%)]" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Brand />
        <ThemeToggle />
      </header>
      <section className="relative mx-auto flex min-h-[calc(100vh-76px)] max-w-6xl items-center justify-center px-4 pb-12 sm:px-8">
        {children}
      </section>
    </main>
  );
}
