import { Exception } from '@exception';
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { FastifyRequest } from 'fastify';
import { getClientIp } from 'request-ip';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  override throwThrottlingException(): Promise<void> {
    throw new Exception('RATE_LIMIT_REQUEST');
  }

  override async getTracker(req: FastifyRequest): Promise<string> {
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'];
    const defaultTracker = `${ip}-${userAgent}`;

    return [defaultTracker].join('-');
  }
}
