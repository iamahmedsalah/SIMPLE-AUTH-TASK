import { randomUUID } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import { MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { configuration, type AppConfiguration } from './config/configuration';
import { initializeEnvironment } from './config/environment';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['../../.env', '.env'],
      validate: initializeEnvironment,
      load: [configuration],
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfiguration, true>) => ({
        pinoHttp: {
          level: config.get('app.logLevel', { infer: true }),
          genReqId: (request: IncomingMessage) => {
            const header = request.headers['x-request-id'];
            return typeof header === 'string' && header.length <= 128 ? header : randomUUID();
          },
          customProps: () => ({ environment: config.get('app.environment', { infer: true }) }),
          redact: {
            paths: [
              'req.headers.authorization',
              'req.headers.cookie',
              'res.headers.set-cookie',
              '*.password',
              '*.newPassword',
              '*.token',
            ],
            censor: '[REDACTED]',
          },
        },
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfiguration, true>) => ({
        uri: config.get('database.uri', { infer: true }),
        maxPoolSize: 10,
        minPoolSize: 1,
        serverSelectionTimeoutMS: 5_000,
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    AuthModule,
    HealthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
