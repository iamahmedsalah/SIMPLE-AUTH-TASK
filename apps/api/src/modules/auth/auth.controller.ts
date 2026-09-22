import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import {
  forgotPasswordSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema,
  type ForgotPasswordInput,
  type ResendVerificationInput,
  type ResetPasswordInput,
  type SignInInput,
  type SignUpInput,
  type VerifyEmailInput,
} from '@fst/validation';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import type { AppConfiguration } from '../../config/configuration';
import { AuthGuard, type AuthenticatedRequest } from './auth.guard';
import { AuthService, toPublicUser } from './auth.service';

const credentialsSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', format: 'password' },
  },
};

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly cookieName: string;
  private readonly cookieMaxAgeMs: number;
  private readonly production: boolean;

  constructor(
    private readonly auth: AuthService,
    config: ConfigService<AppConfiguration, true>,
  ) {
    this.cookieName = config.get('auth.cookieName', { infer: true });
    this.cookieMaxAgeMs = config.get('auth.jwtExpiresInSeconds', { infer: true }) * 1_000;
    this.production = config.get('app.environment', { infer: true }) === 'production';
  }

  @Post('signup')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @UsePipes(new ZodValidationPipe(signUpSchema))
  @ApiOperation({ summary: 'Create an account and send a verification email' })
  @ApiBody({
    schema: {
      ...credentialsSchema,
      required: ['name', 'email', 'password'],
      properties: { name: { type: 'string', minLength: 3 }, ...credentialsSchema.properties },
    },
  })
  @ApiResponse({ status: 201, description: 'Account created' })
  signUp(@Body() input: SignUpInput) {
    return this.auth.signUp(input);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  @UsePipes(new ZodValidationPipe(signInSchema))
  @ApiOperation({ summary: 'Sign in and set the authentication cookie' })
  @ApiBody({ schema: credentialsSchema })
  async signIn(@Body() input: SignInInput, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.signIn(input);
    response.cookie(this.cookieName, result.token, this.cookieOptions());
    return { user: result.user };
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @UsePipes(new ZodValidationPipe(verifyEmailSchema))
  @ApiOperation({ summary: 'Consume a one-time email verification token' })
  @ApiBody({
    schema: { type: 'object', required: ['token'], properties: { token: { type: 'string' } } },
  })
  verifyEmail(@Body() input: VerifyEmailInput) {
    return this.auth.verifyEmail(input);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 15 * 60_000 } })
  @UsePipes(new ZodValidationPipe(resendVerificationSchema))
  @ApiOperation({ summary: 'Request a replacement verification email' })
  resendVerification(@Body() input: ResendVerificationInput) {
    return this.auth.resendVerification(input);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 15 * 60_000 } })
  @UsePipes(new ZodValidationPipe(forgotPasswordSchema))
  @ApiOperation({ summary: 'Request a password reset email' })
  forgotPassword(@Body() input: ForgotPasswordInput) {
    return this.auth.forgotPassword(input);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 15 * 60_000 } })
  @UsePipes(new ZodValidationPipe(resetPasswordSchema))
  @ApiOperation({ summary: 'Consume a reset token and replace the password' })
  resetPassword(@Body() input: ResetPasswordInput) {
    return this.auth.resetPassword(input);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('auth-cookie')
  @ApiOperation({ summary: 'Return the current authenticated user' })
  me(@Req() request: AuthenticatedRequest) {
    return { user: toPublicUser(request.user) };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiCookieAuth('auth-cookie')
  @ApiOperation({ summary: 'Clear the authentication cookie' })
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(this.cookieName, { ...this.cookieOptions(), maxAge: undefined });
    return { message: 'Signed out successfully' };
  }

  private cookieOptions() {
    return {
      httpOnly: true,
      secure: this.production,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: this.cookieMaxAgeMs,
    };
  }
}
