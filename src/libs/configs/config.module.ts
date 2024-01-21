import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  appConfig,
  cacheConfig,
  jwtConfig,
  mongooseConfig,
  rateLimitConfig,
} from './registers';
import { ConfigProvider } from './config.eum';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        mongooseConfig,
        cacheConfig,
        appConfig,
        jwtConfig,
        rateLimitConfig,
      ],
    }),
  ],
  providers: [
    {
      provide: ConfigProvider.APP,
      useFactory: appConfig,
    },
    {
      provide: ConfigProvider.CACHE,
      useFactory: cacheConfig,
    },
    {
      provide: ConfigProvider.JWT,
      useFactory: jwtConfig,
    },
    {
      provide: ConfigProvider.MONGOOSE,
      useFactory: mongooseConfig,
    },
    {
      provide: ConfigProvider.RATE_LIMIT,
      useFactory: rateLimitConfig,
    },
  ],
  exports: [
    ConfigProvider.APP,
    ConfigProvider.CACHE,
    ConfigProvider.JWT,
    ConfigProvider.MONGOOSE,
    ConfigProvider.RATE_LIMIT,
  ],
})
export class ConfigurationModule {}
