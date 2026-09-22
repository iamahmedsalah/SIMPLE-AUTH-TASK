import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1.5rem' },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        border: 'hsl(var(--border))',
        destructive: 'hsl(var(--destructive))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: { xl: 'var(--radius)', lg: 'calc(var(--radius) - 2px)' },
      boxShadow: { card: '0 24px 80px -28px hsl(220 40% 5% / 0.35)' },
    },
  },
  plugins: [],
} satisfies Config;
