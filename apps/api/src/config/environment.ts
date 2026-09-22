import { z } from 'zod';
import { isIP } from 'node:net';
import { configureDnsServers } from './dns';

const booleanString = z.enum(['true', 'false']).transform((value) => value === 'true');
const dnsServers = z
  .string()
  .default('')
  .transform((value) =>
    value
      .split(',')
      .map((server) => server.trim())
      .filter(Boolean),
  )
  .refine((servers) => servers.every((server) => isIP(server) !== 0), {
    message: 'DNS_SERVERS must be a comma-separated list of IP addresses',
  });

const environmentSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
    MONGODB_URI: z.string().min(1),
    DNS_SERVERS: dnsServers,
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z
      .string()
      .regex(/^\d+[smhd]$/)
      .default('15m'),
    FRONTEND_URL: z.string().url(),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.coerce.number().int().min(1).max(65_535),
    SMTP_SECURE: booleanString.default(false),
    SMTP_USER: z.string().default(''),
    SMTP_PASS: z.string().default(''),
    SMTP_FROM: z.string().trim().min(3).optional(),
    SMTP_FROM_EMAIL: z.string().trim().min(3).optional(),
    SWAGGER_ENABLED: booleanString.default(true),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
    COOKIE_NAME: z.string().min(1).default('fst_auth'),
  })
  .superRefine((config, context) => {
    if (config.SMTP_HOST.toLowerCase() === 'smtp.gmail.com') {
      if (!config.SMTP_USER) {
        context.addIssue({
          code: 'custom',
          path: ['SMTP_USER'],
          message: 'Required when using Gmail SMTP',
        });
      }
      if (!config.SMTP_PASS) {
        context.addIssue({
          code: 'custom',
          path: ['SMTP_PASS'],
          message: 'Use a Google App Password when using Gmail SMTP',
        });
      }
      if (config.SMTP_PORT === 465 && !config.SMTP_SECURE) {
        context.addIssue({
          code: 'custom',
          path: ['SMTP_SECURE'],
          message: 'Must be true for Gmail on port 465',
        });
      }
    }
    if (config.NODE_ENV === 'production') {
      if (!config.SMTP_USER) {
        context.addIssue({
          code: 'custom',
          path: ['SMTP_USER'],
          message: 'Required in production',
        });
      }
      if (!config.SMTP_PASS) {
        context.addIssue({
          code: 'custom',
          path: ['SMTP_PASS'],
          message: 'Required in production',
        });
      }
      if (!config.SMTP_FROM && !config.SMTP_FROM_EMAIL) {
        context.addIssue({
          code: 'custom',
          path: ['SMTP_FROM'],
          message: 'Required in production',
        });
      }
    }
  })
  .transform((config) => ({
    ...config,
    SMTP_FROM: config.SMTP_FROM ?? config.SMTP_FROM_EMAIL ?? 'Northstar <no-reply@localhost>',
  }));

export type Environment = z.infer<typeof environmentSchema>;

export function validateEnvironment(input: Record<string, unknown>): Environment {
  const result = environmentSchema.safeParse(input);
  if (!result.success) {
    const summary = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration: ${summary}`);
  }
  return result.data;
}

export function initializeEnvironment(input: Record<string, unknown>): Environment {
  const environment = validateEnvironment(input);
  configureDnsServers(environment.DNS_SERVERS);
  return environment;
}
