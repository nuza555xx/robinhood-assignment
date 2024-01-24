import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger, ValidationPipe } from '@nestjs/common';
import { getHelmetOptions, Documentation } from '@utils';
import { fastifyCompress } from '@fastify/compress';
import fastifyCsrf from '@fastify/csrf-protection';
import { fastifyHelmet } from '@fastify/helmet';
import { AppConfig, ConfigProvider } from '@configs';

const BootstrapApplication = async (): Promise<void> => {
  const fastifyAdapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  const pathPrefix = 'api';
  const appConfig = app.get<AppConfig>(ConfigProvider.APP);

  app.enableShutdownHooks();

  app.enableCors({
    origin: appConfig.cors,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  app.useBodyParser('json', { bodyLimit: 50 * 1000 * 1024 });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix(pathPrefix);

  const pathDoc = `${pathPrefix}/documentations`;
  if (appConfig.environment === 'development') {
    Documentation.setup(
      appConfig.projectName,
      'desc',
      pathDoc,
      app,
      appConfig.environment,
      appConfig.version,
    );
  }

  await Promise.all([
    app.register(fastifyCsrf as any),
    app.register(fastifyHelmet as any, getHelmetOptions),
    app.register(fastifyCompress as any, { encodings: ['gzip', 'deflate'] }),
  ]);

  await app.listen(appConfig.port, '0.0.0.0');

  const logger = new Logger(BootstrapApplication.name);
  logger.log(
    `🚀 Documentations is running on: ${await app.getUrl()}/${pathDoc}`,
  );
  logger.log(`🚀 Environment at ${appConfig.environment}`);
};

BootstrapApplication();
