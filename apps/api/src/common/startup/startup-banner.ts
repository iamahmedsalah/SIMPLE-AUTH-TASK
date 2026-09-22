export interface StartupBannerOptions {
  environment: string;
  port: number;
  swaggerEnabled: boolean;
  logLevel: string;
}

const ANSI = {
  cyan: '\u001B[36m',
  green: '\u001B[32m',
  yellow: '\u001B[33m',
  reset: '\u001B[0m',
} as const;

export function createStartupBanner(options: StartupBannerOptions, color = false): string {
  const width = 56;
  const border = `+${'-'.repeat(width)}+`;
  const environment = options.environment.toUpperCase();
  const environmentTone = options.environment === 'production' ? ANSI.yellow : ANSI.green;
  const row = (label: string, value: string, tone?: string) => {
    const raw = `${label.padEnd(13)}${value}`;
    const visible = tone && color ? `${tone}${raw}${ANSI.reset}` : raw;
    return `| ${visible}${' '.repeat(Math.max(0, width - 2 - raw.length))} |`;
  };

  return [
    border,
    row('NORTHSTAR API', '', ANSI.cyan),
    row('Environment', environment, environmentTone),
    row('API', `http://localhost:${options.port}/api/v1`),
    row(
      'Swagger',
      options.swaggerEnabled ? `http://localhost:${options.port}/api/docs` : 'disabled',
    ),
    row('Logging', options.logLevel),
    border,
  ].join('\n');
}

export function printStartupBanner(options: StartupBannerOptions): void {
  process.stdout.write(`\n${createStartupBanner(options, process.stdout.isTTY)}\n\n`);
}
