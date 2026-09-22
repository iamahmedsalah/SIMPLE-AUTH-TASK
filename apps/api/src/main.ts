import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createApp } from './app.factory';
import { printStartupBanner } from './common/startup/startup-banner';
import type { AppConfiguration } from './config/configuration';

async function bootstrap(): Promise<void> {
  const app = await createApp({ shutdownHooks: true });
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

void bootstrap();
