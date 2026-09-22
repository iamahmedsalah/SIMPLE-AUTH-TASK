import type { Plugin } from 'vite';

const ANSI = {
  cyan: '\u001B[36m',
  green: '\u001B[32m',
  dim: '\u001B[2m',
  reset: '\u001B[0m',
} as const;

export function developmentBannerPlugin(): Plugin {
  return {
    name: 'northstar-development-banner',
    apply: 'serve',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const webUrl = server.resolvedUrls?.local[0] ?? 'http://localhost:5173/';
        process.stdout.write(createWebBanner(webUrl, process.stdout.isTTY));
      });
    },
  };
}

export function createWebBanner(webUrl: string, color: boolean): string {
  const width = 56;
  const border = `+${'-'.repeat(width)}+`;
  const row = (label: string, value: string, tone?: keyof typeof ANSI) => {
    const raw = `${label.padEnd(13)}${value}`;
    const visible = tone && color ? `${ANSI[tone]}${raw}${ANSI.reset}` : raw;
    return `| ${visible}${' '.repeat(Math.max(0, width - 2 - raw.length))} |`;
  };

  return [
    '',
    border,
    row('NORTHSTAR WEB', '', 'cyan'),
    row('Environment', 'DEVELOPMENT', 'green'),
    row('Web', webUrl),
    row('API proxy', '/api -> http://127.0.0.1:3000', 'dim'),
    border,
    '',
  ].join('\n');
}
