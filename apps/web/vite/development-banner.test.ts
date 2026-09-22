import { createWebBanner } from './development-banner';

describe('createWebBanner', () => {
  it('shows development URLs without terminal control codes when color is disabled', () => {
    const banner = createWebBanner('http://localhost:5173/', false);

    expect(banner).toContain('NORTHSTAR WEB');
    expect(banner).toContain('DEVELOPMENT');
    expect(banner).toContain('http://localhost:5173/');
    expect(banner).toContain('/api -> http://127.0.0.1:3000');
    expect(banner).not.toContain('\u001B');
  });
});
