import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Brand() {
  return (
    <Link to="/" className="inline-flex items-center gap-2 text-base font-bold tracking-tight">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="size-4" />
      </span>
      Northstar
    </Link>
  );
}
