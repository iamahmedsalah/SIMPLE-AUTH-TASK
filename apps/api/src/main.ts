import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { Logger as PinoLogger, PinoLogger as InjectablePinoLogger } from 'nestjs-pino';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { printStartupBanner } from './common/startup/startup-banner';
import { AppModule } from './app.module';
import type { AppConfiguration } from './config/configuration';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true, bodyParser: false });
  app.useLogger(app.get(PinoLogger));
  const config = app.get<ConfigService<AppConfiguration, true>>(ConfigService);
  const environment = config.get('app.environment', { infer: true });
  const port = config.get('app.port', { infer: true });
  const swaggerEnabled = config.get('app.swaggerEnabled', { infer: true });

  app.use(helmet());
  app.use(json({ limit: '100kb' }));
  app.use(urlencoded({ extended: false, limit: '100kb' }));
  app.use(cookieParser());
  app.enableCors({ origin: config.get('app.frontendUrl', { infer: true }), credentials: true });
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new HttpExceptionFilter(await app.resolve(InjectablePinoLogger)));
  app.enableShutdownHooks();

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

  await app.listen(port);
  printStartupBanner({
    environment,
    port,
    swaggerEnabled,
    logLevel: config.get('app.logLevel', { infer: true }),
  });
  Logger.log('API started successfully', 'Bootstrap');
}

void bootstrap();
