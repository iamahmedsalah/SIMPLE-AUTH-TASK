import { Types, type Model } from 'mongoose';
import * as argon2 from 'argon2';
import { AuthService, hashToken, normalizeEmail } from './auth.service';
import { AuthTokenType, type AuthToken } from '../tokens/schemas/auth-token.schema';
import type { User, UserDocument } from '../users/schemas/user.schema';
import type { EmailService } from '../email/email.service';
import type { JwtService } from '@nestjs/jwt';
import type { ConfigService } from '@nestjs/config';
import type { AppConfiguration } from '../../config/configuration';

const objectId = new Types.ObjectId();
const baseUser = {
  _id: objectId,
  id: objectId.toHexString(),
  name: 'Ahmed Salah',
  email: 'ahmed@example.com',
  emailVerifiedAt: new Date(),
  authVersion: 0,
  passwordHash: '',
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
} as UserDocument;

function query<T>(value: T) {
  return { select: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(value) };
}

function setup() {
  const users = {
    exists: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };
  const tokens = {
    deleteMany: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    create: jest.fn().mockResolvedValue({}),
    findOneAndDelete: jest.fn(),
  };
  const jwt = { signAsync: jest.fn().mockResolvedValue('signed.jwt') };
  const email = { sendVerificationEmail: jest.fn(), sendPasswordResetEmail: jest.fn() };
  const config = {
    get: jest.fn((key: string) => (key === 'app.frontendUrl' ? 'http://localhost:5173' : 900)),
  };
  const service = new AuthService(
    users as unknown as Model<User>,
    tokens as unknown as Model<AuthToken>,
    jwt as unknown as JwtService,
    email as unknown as EmailService,
    config as unknown as ConfigService<AppConfiguration, true>,
  );
  return { service, users, tokens, jwt, email };
}

describe('AuthService', () => {
  it('normalizes email and creates only password/token hashes on signup', async () => {
    const { service, users, tokens, email } = setup();
    users.exists.mockResolvedValue(null);
    users.create.mockImplementation(async (input: { email: string; passwordHash: string }) => ({
      ...baseUser,
      email: input.email,
      passwordHash: input.passwordHash,
    }));

    const result = await service.signUp({
      name: 'Ahmed Salah',
      email: ' Ahmed@Example.COM ',
      password: 'Secure1!',
    });

    const created = users.create.mock.calls[0]?.[0] as { email: string; passwordHash: string };
    expect(created.email).toBe('ahmed@example.com');
    expect(created.passwordHash).not.toBe('Secure1!');
    expect(await argon2.verify(created.passwordHash, 'Secure1!')).toBe(true);
    const stored = tokens.create.mock.calls[0]?.[0] as { tokenHash: string };
    const raw = email.sendVerificationEmail.mock.calls[0]?.[2] as string;
    expect(raw).not.toContain(stored.tokenHash);
    expect(stored.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(result.emailSent).toBe(true);
  });

  it('keeps the account and reports when verification delivery fails', async () => {
    const { service, users, tokens, email } = setup();
    users.exists.mockResolvedValue(null);
    users.create.mockResolvedValue({ ...baseUser, emailVerifiedAt: undefined });
    email.sendVerificationEmail.mockRejectedValue(
      Object.assign(new Error('SMTP rejected'), { code: 'EAUTH' }),
    );

    const result = await service.signUp({
      name: 'Ahmed Salah',
      email: 'ahmed@example.com',
      password: 'Secure1!',
    });

    expect(result.emailSent).toBe(false);
    expect(result.message).toContain('could not be delivered');
    expect(tokens.create).toHaveBeenCalled();
    expect(users.create).toHaveBeenCalled();
  });

  it('returns one generic error for an unknown login', async () => {
    const { service, users } = setup();
    users.findOne.mockReturnValue(query(null));
    await expect(
      service.signIn({ email: 'missing@example.com', password: 'Whatever1!' }),
    ).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'INVALID_CREDENTIALS' }),
    });
  });

  it('signs minimal claims after valid verified credentials', async () => {
    const { service, users, jwt } = setup();
    const passwordHash = await argon2.hash('Secure1!');
    users.findOne.mockReturnValue(query({ ...baseUser, passwordHash }));

    const result = await service.signIn({ email: 'AHMED@example.com', password: 'Secure1!' });

    expect(result.token).toBe('signed.jwt');
    expect(jwt.signAsync).toHaveBeenCalledWith(
      { sub: objectId.toHexString(), authVersion: 0 },
      { expiresIn: 900 },
    );
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('atomically consumes a verification token and verifies the user', async () => {
    const { service, users, tokens } = setup();
    tokens.findOneAndDelete.mockReturnValue(
      query({ userId: objectId, type: AuthTokenType.EmailVerification }),
    );
    users.findByIdAndUpdate.mockResolvedValue(baseUser);

    await expect(service.verifyEmail({ token: 'v'.repeat(43) })).resolves.toEqual({
      message: 'Email verified. You can now sign in.',
    });
    expect(tokens.findOneAndDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        tokenHash: hashToken('v'.repeat(43)),
        expiresAt: expect.objectContaining({ $gt: expect.any(Date) }),
      }),
    );
  });

  it('rejects an expired or already-consumed verification token', async () => {
    const { service, tokens } = setup();
    tokens.findOneAndDelete.mockReturnValue(query(null));
    await expect(service.verifyEmail({ token: 'x'.repeat(43) })).rejects.toMatchObject({
      code: 'INVALID_TOKEN',
    });
  });

  it('keeps forgot-password responses generic for unknown accounts', async () => {
    const { service, users, tokens, email } = setup();
    users.findOne.mockResolvedValue(null);
    await expect(service.forgotPassword({ email: 'missing@example.com' })).resolves.toEqual({
      message: 'If an account exists for this email, a reset link has been sent.',
    });
    expect(tokens.create).not.toHaveBeenCalled();
    expect(email.sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it('increments authVersion and consumes reset tokens once', async () => {
    const { service, users, tokens } = setup();
    tokens.findOneAndDelete.mockReturnValue(
      query({ userId: objectId, type: AuthTokenType.PasswordReset }),
    );
    users.findByIdAndUpdate.mockResolvedValue(baseUser);

    await service.resetPassword({ token: 'a'.repeat(43), newPassword: 'Changed1!' });

    expect(tokens.findOneAndDelete).toHaveBeenCalledWith(
      expect.objectContaining({ tokenHash: hashToken('a'.repeat(43)) }),
    );
    expect(users.findByIdAndUpdate).toHaveBeenCalledWith(
      objectId,
      expect.objectContaining({ $inc: { authVersion: 1 } }),
    );

    tokens.findOneAndDelete.mockReturnValue(query(null));
    await expect(
      service.resetPassword({ token: 'a'.repeat(43), newPassword: 'Changed2!' }),
    ).rejects.toMatchObject({ code: 'INVALID_TOKEN' });
  });
});

describe('auth helpers', () => {
  it('normalizes email consistently', () =>
    expect(normalizeEmail(' User@Example.COM ')).toBe('user@example.com'));
  it('hashes tokens deterministically without retaining raw values', () => {
    expect(hashToken('secret')).toBe(hashToken('secret'));
    expect(hashToken('secret')).not.toContain('secret');
  });
});
