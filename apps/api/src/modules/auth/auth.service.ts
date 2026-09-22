import { createHash, randomBytes } from 'node:crypto';
import {
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Model, type Types } from 'mongoose';
import type {
  ForgotPasswordInput,
  ResendVerificationInput,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
  VerifyEmailInput,
} from '@fst/validation';
import type { AppConfiguration } from '../../config/configuration';
import { AppException } from '../../common/errors/app.exception';
import { EmailService } from '../email/email.service';
import { AuthToken, AuthTokenType } from '../tokens/schemas/auth-token.schema';
import { User, type UserDocument } from '../users/schemas/user.schema';
import type { AuthResult, JwtPayload, PublicUser } from './auth.types';

const VERIFICATION_LIFETIME_MS = 24 * 60 * 60 * 1_000;
const RESET_LIFETIME_MS = 60 * 60 * 1_000;
const ARGON_OPTIONS: argon2.Options & { raw?: false } = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
};
const DUMMY_PASSWORD_HASH =
  '$argon2id$v=19$m=19456,t=2,p=1$nNIG1YV1h1oawPP48cp4ZQ$lUPbcrXBAkO2vRTIDAkQeKOe73eh8uPoAiZC0JwpzeA';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly frontendUrl: string;
  private readonly jwtExpiresInSeconds: number;

  constructor(
    @InjectModel(User.name) private readonly users: Model<User>,
    @InjectModel(AuthToken.name) private readonly tokens: Model<AuthToken>,
    private readonly jwt: JwtService,
    private readonly email: EmailService,
    config: ConfigService<AppConfiguration, true>,
  ) {
    this.frontendUrl = config.get('app.frontendUrl', { infer: true });
    this.jwtExpiresInSeconds = config.get('auth.jwtExpiresInSeconds', { infer: true });
  }

  async signUp(
    input: SignUpInput,
  ): Promise<{ user: PublicUser; message: string; emailSent: boolean }> {
    const email = normalizeEmail(input.email);

    // Fast index-only check — avoids running expensive argon2 hash on duplicate emails.
    // The duplicate-key catch below remains as a race guard for concurrent signups.
    if (await this.users.exists({ email })) {
      throw new ConflictException({
        statusCode: 409,
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'An account with this email already exists',
      });
    }

    const passwordHash = await argon2.hash(input.password, ARGON_OPTIONS);
    let user: UserDocument;
    try {
      user = await this.users.create({ name: input.name, email, passwordHash });
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        throw new ConflictException({
          statusCode: 409,
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'An account with this email already exists',
        });
      }
      throw error;
    }

    const rawToken = await this.replaceToken(
      user._id,
      AuthTokenType.EmailVerification,
      VERIFICATION_LIFETIME_MS,
    );
    const emailSent = await this.deliverVerificationEmail(user, rawToken);

    return {
      user: toPublicUser(user),
      emailSent,
      message: emailSent
        ? 'Account created. Check your email to verify it.'
        : 'Account created, but the verification email could not be delivered. Continue to sign in and request a new verification email.',
    };
  }

  async signIn(input: SignInInput): Promise<AuthResult> {
    const user = await this.users
      .findOne({ email: normalizeEmail(input.email) })
      .select('+passwordHash +authVersion')
      .exec();
    const passwordMatches = await argon2.verify(
      user?.passwordHash ?? DUMMY_PASSWORD_HASH,
      input.password,
    );
    if (!user || !passwordMatches) {
      throw new UnauthorizedException({
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      });
    }
    if (!user.emailVerifiedAt) {
      throw new AppException(
        'EMAIL_NOT_VERIFIED',
        'Verify your email before signing in',
        HttpStatus.FORBIDDEN,
      );
    }

    const payload: JwtPayload = { sub: String(user._id), authVersion: user.authVersion };
    const token = await this.jwt.signAsync(payload, { expiresIn: this.jwtExpiresInSeconds });
    return { token, user: toPublicUser(user) };
  }

  async verifyEmail(input: VerifyEmailInput): Promise<{ message: string }> {
    const token = await this.consumeToken(input.token, AuthTokenType.EmailVerification);
    const user = await this.users.findByIdAndUpdate(
      token.userId,
      { $set: { emailVerifiedAt: new Date() } },
      { new: true },
    );
    if (!user) throw invalidToken();
    await this.tokens.deleteMany({ userId: user._id, type: AuthTokenType.EmailVerification });
    return { message: 'Email verified. You can now sign in.' };
  }

  async resendVerification(input: ResendVerificationInput): Promise<{ message: string }> {
    const generic = {
      message: 'If the account exists and is unverified, a verification email has been sent.',
    };
    const user = await this.users.findOne({ email: normalizeEmail(input.email) });
    if (!user || user.emailVerifiedAt) return generic;

    const rawToken = await this.replaceToken(
      user._id,
      AuthTokenType.EmailVerification,
      VERIFICATION_LIFETIME_MS,
    );
    await this.deliverVerificationEmail(user, rawToken);
    return generic;
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<{ message: string }> {
    const generic = { message: 'If an account exists for this email, a reset link has been sent.' };
    const user = await this.users.findOne({ email: normalizeEmail(input.email) });
    if (!user) return generic;

    const rawToken = await this.replaceToken(
      user._id,
      AuthTokenType.PasswordReset,
      RESET_LIFETIME_MS,
    );
    try {
      await this.email.sendPasswordResetEmail(
        user.email,
        user.name,
        `${this.frontendUrl}/reset-password?token=${encodeURIComponent(rawToken)}`,
      );
      this.logger.log({ event: 'PASSWORD_RESET_EMAIL_SENT', userId: String(user._id) });
    } catch (error: unknown) {
      this.logger.warn(
        {
          event: 'PASSWORD_RESET_EMAIL_FAILED',
          userId: String(user._id),
          errorCode: emailErrorCode(error),
        },
        'Password reset email delivery failed',
      );
    }
    return generic;
  }

  async resetPassword(input: ResetPasswordInput): Promise<{ message: string }> {
    const token = await this.consumeToken(input.token, AuthTokenType.PasswordReset);
    const passwordHash = await argon2.hash(input.newPassword, ARGON_OPTIONS);
    const user = await this.users.findByIdAndUpdate(token.userId, {
      $set: { passwordHash },
      $inc: { authVersion: 1 },
    });
    if (!user) throw invalidToken();
    await this.tokens.deleteMany({ userId: user._id, type: AuthTokenType.PasswordReset });
    return { message: 'Password reset successfully. Sign in with your new password.' };
  }

  private async replaceToken(
    userId: Types.ObjectId,
    type: AuthTokenType,
    lifetimeMs: number,
  ): Promise<string> {
    const rawToken = randomBytes(32).toString('base64url');
    // Single atomic upsert — replaces any existing token for this user+type in one
    // round-trip, eliminating the deleteMany+create race window.
    await this.tokens.findOneAndReplace(
      { userId, type },
      {
        userId,
        type,
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(Date.now() + lifetimeMs),
      },
      { upsert: true },
    );
    return rawToken;
  }

  private async deliverVerificationEmail(user: UserDocument, rawToken: string): Promise<boolean> {
    try {
      await this.email.sendVerificationEmail(
        user.email,
        user.name,
        `${this.frontendUrl}/verify-email?token=${encodeURIComponent(rawToken)}`,
      );
      this.logger.log({ event: 'EMAIL_VERIFICATION_SENT', userId: String(user._id) });
      return true;
    } catch (error: unknown) {
      this.logger.warn(
        {
          event: 'VERIFICATION_EMAIL_FAILED',
          userId: String(user._id),
          errorCode: emailErrorCode(error),
        },
        'Verification email delivery failed',
      );
      return false;
    }
  }

  private async consumeToken(rawToken: string, type: AuthTokenType): Promise<AuthToken> {
    const token = await this.tokens
      .findOneAndDelete({ tokenHash: hashToken(rawToken), type, expiresAt: { $gt: new Date() } })
      .select('+tokenHash')
      .exec();
    if (!token) throw invalidToken();
    return token;
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function toPublicUser(user: UserDocument): PublicUser {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    emailVerified: Boolean(user.emailVerifiedAt),
    createdAt: user.createdAt.toISOString(),
  };
}

function invalidToken(): AppException {
  return new AppException(
    'INVALID_TOKEN',
    'This token is invalid or has expired',
    HttpStatus.BAD_REQUEST,
  );
}

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 11_000;
}

function emailErrorCode(error: unknown): string {
  if (typeof error !== 'object' || error === null || !('code' in error)) return 'UNKNOWN';
  return typeof error.code === 'string' ? error.code : 'UNKNOWN';
}
