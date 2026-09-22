import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { id, label, error, type, className, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const password = type === 'password';
  const errorId = `${id}-error`;
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <Input
          ref={ref}
          id={id}
          type={password && visible ? 'text' : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(password && 'pr-11', className)}
          {...props}
        />
        {password ? (
          <Button
            type="button"
            variant="ghost"
            className="absolute right-0 top-0 size-11 px-0 text-muted-foreground"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          </Button>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-destructive" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  );
});
