import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';
import type { AppConfiguration } from '../../config/configuration';
import { passwordResetEmailTemplate } from './templates/reset-password';
import { verificationEmailTemplate } from './templates/verify-email';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor(config: ConfigService<AppConfiguration, true>) {
    const smtp = config.get('smtp', { infer: true });
    this.from = smtp.from;
    this.transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
      ...(smtp.user ? { auth: { user: smtp.user, pass: smtp.pass } } : {}),
    });
  }

  async sendVerificationEmail(to: string, name: string, verificationUrl: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to,
      ...verificationEmailTemplate(name, verificationUrl),
    });
  }

  async sendPasswordResetEmail(to: string, name: string, resetUrl: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to,
      ...passwordResetEmailTemplate(name, resetUrl),
    });
  }
}
