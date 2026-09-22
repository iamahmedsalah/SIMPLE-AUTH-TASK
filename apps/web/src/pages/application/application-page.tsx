import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, LogOut, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Brand } from '@/components/layout/brand';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { useCurrentUser, useLogout } from '@/features/auth/hooks/auth-hooks';

export default function ApplicationPage() {
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const navigate = useNavigate();
  const signOut = async () => {
    await logout.mutateAsync();
    void navigate('/sign-in', { replace: true });
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Brand />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="ghost" className="gap-2">
                  <span className="grid size-7 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline">{user?.name}</span>
                  <ChevronDown className="size-3.5" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  className="z-50 w-56 rounded-lg border bg-card p-1 shadow-card"
                >
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-medium">{user?.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenu.Separator className="my-1 h-px bg-border" />
                  <DropdownMenu.Item
                    onSelect={() => void signOut()}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive outline-none focus:bg-muted"
                  >
                    <LogOut className="size-4" />
                    Log out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold text-primary">
            <ShieldCheck className="size-4" />
            Authenticated workspace
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to the application.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Your session is protected by a secure, HttpOnly cookie and verified against the current
            account state.
          </p>
        </div>
      </section>
    </main>
  );
}
