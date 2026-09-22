import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import type { Request } from 'express';
import { Model, isValidObjectId } from 'mongoose';
import type { AppConfiguration } from '../../config/configuration';
import { User, type UserDocument } from '../users/schemas/user.schema';
import type { JwtPayload } from './auth.types';

export interface AuthenticatedRequest extends Request {
  user: UserDocument;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly cookieName: string;

  constructor(
    private readonly jwt: JwtService,
    @InjectModel(User.name) private readonly users: Model<User>,
    config: ConfigService<AppConfiguration, true>,
  ) {
    this.cookieName = config.get('auth.cookieName', { infer: true });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const cookies = request.cookies as Record<string, unknown> | undefined;
    const token = cookies?.[this.cookieName];
    if (typeof token !== 'string') throw unauthorized();

    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(token);
    } catch {
      throw unauthorized();
    }
    if (!payload.sub || !isValidObjectId(payload.sub) || !Number.isInteger(payload.authVersion)) {
      throw unauthorized();
    }

    const user = await this.users.findById(payload.sub).select('+authVersion').exec();
    if (!user || user.authVersion !== payload.authVersion) throw unauthorized();
    request.user = user;
    return true;
  }
}

function unauthorized(): UnauthorizedException {
  return new UnauthorizedException({
    statusCode: 401,
    code: 'UNAUTHORIZED',
    message: 'Authentication required',
  });
}
