import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { AbstractHttpAdapter } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { Logger as PinoLogger, PinoLogger as InjectablePinoLogger } from 'nestjs-pino';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppModule } from './app.module';
import type { AppConfiguration } from './config/configuration';

export interface CreateAppOptions {
  httpAdapter?: AbstractHttpAdapter;
  swagger?: boolean;
  shutdownHooks?: boolean;
}

export async function createApp(options: CreateAppOptions = {}): Promise<INestApplication> {
  const { httpAdapter, shutdownHooks = true } = options;

  const app = httpAdapter
    ? await NestFactory.create(AppModule, httpAdapter, { bufferLogs: true, bodyParser: false })
    : await NestFactory.create(AppModule, { bufferLogs: true, bodyParser: false });

  app.useLogger(app.get(PinoLogger));

  const config = app.get<ConfigService<AppConfiguration, true>>(ConfigService);

  app.use(helmet());
  app.use(json({ limit: '100kb' }));
  app.use(urlencoded({ extended: false, limit: '100kb' }));
  app.use(cookieParser());
  app.enableCors({
    origin: config.get('app.frontendUrl', { infer: true }),
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new HttpExceptionFilter(await app.resolve(InjectablePinoLogger)));

  if (shutdownHooks) {
    app.enableShutdownHooks();
  }

  const swaggerEnabled =
    options.swagger ?? config.get('app.swaggerEnabled', { infer: true });

  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Full Stack Auth API')
      .setDescription('Authentication MVP API')
      .setVersion('1.0')
      .addCookieAuth(
        config.get('auth.cookieName', { infer: true }),
        { type: 'apiKey', in: 'cookie' },
        'auth-cookie',
      )
      .build();
    SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swaggerConfig), {
      jsonDocumentUrl: 'api/docs-json',
    });
  }

  return app;
}
