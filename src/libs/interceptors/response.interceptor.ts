import {
  CallHandler,
  CustomDecorator,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyReply } from 'fastify';
import { Observable, map } from 'rxjs';

export const IS_IGNORE_RESPONSE_KEY = 'isIgnoreResponse';
export const IgnoreResponse = (): CustomDecorator =>
  SetMetadata(IS_IGNORE_RESPONSE_KEY, true);

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const isIgnoreResponse = this.reflector.getAllAndOverride<boolean>(
      IS_IGNORE_RESPONSE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isIgnoreResponse) return next.handle();

    return next.handle().pipe(map((val) => this.next(val, context)));
  }

  private next(val: unknown, context: ExecutionContext) {
    const response = context.switchToHttp().getResponse<FastifyReply>();
    return {
      statusCode: response.statusCode,
      message: 'OK',
      data: val ?? null,
    };
  }
}
