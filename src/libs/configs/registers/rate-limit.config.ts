import { registerAs } from '@nestjs/config';
import { ConfigKeys } from '../config.eum';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const rateLimitConfig = registerAs(
  ConfigKeys.RATE_LIMIT,
  (): ThrottlerModuleOptions => {
    return [
      {
        ttl: Number(process.env.RATE_LIMIT_TTL) ?? 1000,
        limit: Number(process.env.RATE_LIMIT_COUNT) ?? 10,
      },
    ];
  },
);
