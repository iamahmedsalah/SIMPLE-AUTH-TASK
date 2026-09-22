import { Check, Circle } from 'lucide-react';

const requirements = [
  ['At least 8 characters', (value: string) => value.length >= 8],
  ['Contains a letter', (value: string) => /[A-Za-z]/.test(value)],
  ['Contains a number', (value: string) => /\d/.test(value)],
  ['Contains a special character', (value: string) => /[^A-Za-z\d]/.test(value)],
] as const;

export function PasswordRequirements({ value }: { value: string }) {
  return (
    <ul
      className="grid grid-cols-1 gap-1 text-xs text-muted-foreground sm:grid-cols-2"
      aria-label="Password requirements"
    >
      {requirements.map(([label, test]) => {
        const met = test(value);
        return (
          <li
            key={label}
            className={met ? 'flex items-center gap-1.5 text-primary' : 'flex items-center gap-1.5'}
          >
            {met ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : (
              <Circle className="size-3" aria-hidden="true" />
            )}
            {label}
          </li>
        );
      })}
    </ul>
  );
}
