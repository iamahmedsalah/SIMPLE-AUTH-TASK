import { passwordResetEmailTemplate } from './reset-password';
import { verificationEmailTemplate } from './verify-email';

describe('Northstar transactional email templates', () => {
  it('renders a branded verification email with escaped user content', () => {
    const email = verificationEmailTemplate(
      '<Ahmed & team>',
      'https://example.com/verify-email?token=abc&source=email',
    );

    expect(email.subject).toBe('Verify your Northstar email');
    expect(email.html).toContain('Northstar');
    expect(email.html).toContain('#3ecf9c');
    expect(email.html).toContain('Verify email address');
    expect(email.html).toContain('&lt;Ahmed &amp; team&gt;');
    expect(email.html).toContain('token=abc&amp;source=email');
    expect(email.html).not.toContain('<Ahmed & team>');
    expect(email.text).toContain('expires in 24 hours');
  });

  it('renders a branded password-reset email with a one-time security notice', () => {
    const email = passwordResetEmailTemplate(
      'Ahmed',
      'https://example.com/reset-password?token=reset-token',
    );

    expect(email.subject).toBe('Reset your Northstar password');
    expect(email.html).toContain('Password recovery');
    expect(email.html).toContain('Choose a new password');
    expect(email.html).toContain('can only be used once');
    expect(email.text).toContain('Your password will stay unchanged');
  });
});
