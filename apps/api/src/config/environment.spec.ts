import { validateEnvironment } from './environment';

const valid = {
  NODE_ENV: 'test',
  PORT: '3000',
  MONGODB_URI: 'mongodb://localhost/test',
  JWT_SECRET: 'a-secure-secret-that-is-at-least-32-characters',
  JWT_EXPIRES_IN: '15m',
  FRONTEND_URL: 'http://localhost:5173',
  SMTP_HOST: 'localhost',
  SMTP_PORT: '1025',
  SMTP_SECURE: 'false',
  SMTP_FROM: 'test@example.com',
  SWAGGER_ENABLED: 'false',
  LOG_LEVEL: 'silent',
};

const validWithoutSender = Object.fromEntries(
  Object.entries(valid).filter(([key]) => key !== 'SMTP_FROM'),
);

describe('validateEnvironment', () => {
  it('coerces safe environment values', () => {
    expect(validateEnvironment({ ...valid, DNS_SERVERS: '8.8.8.8, 1.1.1.1' })).toMatchObject({
      PORT: 3000,
      SMTP_SECURE: false,
      DNS_SERVERS: ['8.8.8.8', '1.1.1.1'],
    });
  });

  it('rejects invalid custom DNS resolvers', () => {
    expect(() => validateEnvironment({ ...valid, DNS_SERVERS: '8.8.8.8,not-an-ip' })).toThrow(
      'DNS_SERVERS',
    );
  });

  it('requires authenticated TLS configuration for Gmail SMTP', () => {
    expect(() =>
      validateEnvironment({
        ...valid,
        SMTP_HOST: 'smtp.gmail.com',
        SMTP_PORT: '465',
        SMTP_SECURE: 'false',
        SMTP_USER: '',
        SMTP_PASS: '',
      }),
    ).toThrow('SMTP_USER');
  });

  it('uses a safe local sender when development SMTP_FROM is omitted', () => {
    expect(validateEnvironment({ ...validWithoutSender, NODE_ENV: 'development' }).SMTP_FROM).toBe(
      'Northstar <no-reply@localhost>',
    );
  });

  it('accepts SMTP_FROM_EMAIL as a sender alias', () => {
    expect(
      validateEnvironment({
        ...validWithoutSender,
        SMTP_FROM_EMAIL: 'Northstar <hello@example.com>',
      }).SMTP_FROM,
    ).toBe('Northstar <hello@example.com>');
  });

  it('rejects weak JWT secrets', () => {
    expect(() => validateEnvironment({ ...valid, JWT_SECRET: 'weak' })).toThrow(
      'Invalid environment configuration',
    );
  });

  it('requires authenticated SMTP in production', () => {
    expect(() => validateEnvironment({ ...valid, NODE_ENV: 'production' })).toThrow('SMTP_USER');
  });

  it('requires an explicit sender in production', () => {
    expect(() =>
      validateEnvironment({
        ...validWithoutSender,
        NODE_ENV: 'production',
        SMTP_USER: 'smtp-user',
        SMTP_PASS: 'smtp-password',
      }),
    ).toThrow('SMTP_FROM');
  });
});
