import { registerAs } from '@nestjs/config';
import { ConfigKeys } from '../config.eum';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import redisStore from 'cache-manager-redis-store';

export const cacheConfig = registerAs(
  ConfigKeys.CACHE,
  (): CacheModuleOptions => {
    return {
      store: redisStore as any,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      db: Number(process.env.REDIS_DB || 0),
      ttl: Number(process.env.REDIS_TTL) || 1000,
    };
  },
);
