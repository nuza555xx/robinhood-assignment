import { Global, Module } from '@nestjs/common';
import {
  CacheModule as CacheCoreModule,
  CacheModuleOptions,
} from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from '@configs';

@Global()
@Module({
  imports: [
    CacheCoreModule.registerAsync({
      useFactory: (configService: ConfigService) =>
        configService.get<CacheModuleOptions>(ConfigKeys.CACHE),
      inject: [ConfigService],
    }),
  ],
})
export class CacheModule {}
