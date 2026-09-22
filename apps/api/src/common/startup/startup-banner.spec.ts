import { createStartupBanner } from './startup-banner';

describe('createStartupBanner', () => {
  it('shows safe development endpoints without configuration secrets', () => {
    const banner = createStartupBanner({
      environment: 'development',
      port: 3000,
      swaggerEnabled: true,
      logLevel: 'debug',
    });

    expect(banner).toContain('DEVELOPMENT');
    expect(banner).toContain('http://localhost:3000/api/v1');
    expect(banner).toContain('http://localhost:3000/api/docs');
    expect(banner).not.toMatch(/secret|mongodb|smtp_pass/i);
  });
});
