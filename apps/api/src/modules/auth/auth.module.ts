import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import type { AppConfiguration } from '../../config/configuration';
import { EmailModule } from '../email/email.module';
import { AuthToken, AuthTokenSchema } from '../tokens/schemas/auth-token.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AuthToken.name, schema: AuthTokenSchema },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfiguration, true>) => ({
        secret: config.get('auth.jwtSecret', { infer: true }),
        signOptions: { expiresIn: config.get('auth.jwtExpiresInSeconds', { infer: true }) },
      }),
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
