import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createApp } from './app.factory';
import { printStartupBanner } from './common/startup/startup-banner';
import type { AppConfiguration } from './config/configuration';

async function bootstrap(): Promise<void> {
  const isVercel = Boolean(process.env.VERCEL);
  const app = await createApp({ shutdownHooks: !isVercel });
  const config = app.get<ConfigService<AppConfiguration, true>>(ConfigService);
  const environment = config.get('app.environment', { infer: true });
  const port = config.get('app.port', { infer: true });
  const swaggerEnabled = config.get('app.swaggerEnabled', { infer: true });

  await app.listen(port);
  printStartupBanner({
    environment,
    port,
    swaggerEnabled,
    logLevel: config.get('app.logLevel', { infer: true }),
  });
  Logger.log('API started successfully', 'Bootstrap');
}

export { NestFactory, AppModule };

void bootstrap();
