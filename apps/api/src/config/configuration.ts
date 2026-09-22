import type { Environment } from './environment';
import { validateEnvironment } from './environment';

export interface AppConfiguration {
  app: {
    environment: Environment['NODE_ENV'];
    port: number;
    frontendUrl: string;
    swaggerEnabled: boolean;
    logLevel: Environment['LOG_LEVEL'];
  };
  database: { uri: string; dnsServers: string[] };
  auth: { jwtSecret: string; jwtExpiresInSeconds: number; cookieName: string };
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
  };
}

export function configuration(): AppConfiguration {
  const environment = validateEnvironment(process.env);
  return {
    app: {
      environment: environment.NODE_ENV,
      port: environment.PORT,
      frontendUrl: environment.FRONTEND_URL,
      swaggerEnabled: environment.SWAGGER_ENABLED,
      logLevel: environment.LOG_LEVEL,
    },
    database: { uri: environment.MONGODB_URI, dnsServers: environment.DNS_SERVERS },
    auth: {
      jwtSecret: environment.JWT_SECRET,
      jwtExpiresInSeconds: parseDurationSeconds(environment.JWT_EXPIRES_IN),
      cookieName: environment.COOKIE_NAME,
    },
    smtp: {
      host: environment.SMTP_HOST,
      port: environment.SMTP_PORT,
      secure: environment.SMTP_SECURE,
      user: environment.SMTP_USER,
      pass: environment.SMTP_PASS,
      from: environment.SMTP_FROM,
    },
  };
}

function parseDurationSeconds(value: string): number {
  const amount = Number.parseInt(value.slice(0, -1), 10);
  const unit = value.at(-1);
  const multipliers: Record<string, number> = { s: 1, m: 60, h: 3_600, d: 86_400 };
  return amount * (multipliers[unit ?? ''] ?? 1);
}
