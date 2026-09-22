import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/app/providers/theme-provider';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" className="size-10 px-0" aria-label="Change color theme">
          <Sun className="size-4 dark:hidden" />
          <Moon className="hidden size-4 dark:block" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 min-w-36 rounded-lg border bg-card p-1 shadow-card"
        >
          {(['light', 'dark', 'system'] as const).map((option) => (
            <DropdownMenu.Item
              key={option}
              onSelect={() => setTheme(option)}
              className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm capitalize outline-none focus:bg-muted"
            >
              {option}
              <Check className={theme === option ? 'size-4' : 'size-4 opacity-0'} />
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
