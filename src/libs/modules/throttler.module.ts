import { ConfigKeys } from '@configs';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

@Global()
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get<ThrottlerModuleOptions>(ConfigKeys.RATE_LIMIT),
      inject: [ConfigService],
    }),
  ],
  exports: [ThrottlerModule],
})
export class RateLimitModule {}
