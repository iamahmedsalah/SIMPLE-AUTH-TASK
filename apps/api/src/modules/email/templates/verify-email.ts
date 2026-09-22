import { transactionalEmailTemplate } from './transactional-email';

export function verificationEmailTemplate(
  name: string,
  verificationUrl: string,
): {
  subject: string;
  text: string;
  html: string;
} {
  return {
    subject: 'Verify your Northstar email',
    text: [
      `Hi ${name},`,
      '',
      'Welcome to Northstar. Confirm your email address to finish creating your account.',
      '',
      `Verify email: ${verificationUrl}`,
      '',
      'This secure link expires in 24 hours and can only be used once.',
      'If you did not create a Northstar account, you can safely ignore this email.',
    ].join('\n'),
    html: transactionalEmailTemplate({
      preheader: 'Confirm your email address to activate your Northstar account.',
      eyebrow: 'Email verification',
      title: 'Verify your email',
      greeting: `Hi ${name},`,
      body: 'Welcome to Northstar. Confirm your email address to finish creating your account and secure your workspace.',
      actionLabel: 'Verify email address',
      actionUrl: verificationUrl,
      expiry: 'This secure link expires in 24 hours and can only be used once.',
      securityNote: 'If you did not create a Northstar account, you can safely ignore this email.',
    }),
  };
}
