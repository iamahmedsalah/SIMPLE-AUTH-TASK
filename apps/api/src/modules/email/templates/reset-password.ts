import { transactionalEmailTemplate } from './transactional-email';

export function passwordResetEmailTemplate(
  name: string,
  resetUrl: string,
): {
  subject: string;
  text: string;
  html: string;
} {
  return {
    subject: 'Reset your Northstar password',
    text: [
      `Hi ${name},`,
      '',
      'We received a request to reset the password for your Northstar account.',
      '',
      `Reset password: ${resetUrl}`,
      '',
      'This secure link expires in one hour and can only be used once.',
      'If you did not request a password reset, ignore this email. Your password will stay unchanged.',
    ].join('\n'),
    html: transactionalEmailTemplate({
      preheader: 'Use this secure, one-time link to reset your Northstar password.',
      eyebrow: 'Password recovery',
      title: 'Reset your password',
      greeting: `Hi ${name},`,
      body: 'We received a request to reset the password for your Northstar account. Use the secure button below to choose a new password.',
      actionLabel: 'Choose a new password',
      actionUrl: resetUrl,
      expiry: 'This secure link expires in one hour and can only be used once.',
      securityNote:
        'If you did not request a password reset, ignore this email. Your password will stay unchanged.',
    }),
  };
}
