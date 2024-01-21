import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const { method, url } = context.switchToHttp().getRequest<FastifyRequest>();
    const { statusCode } = context.switchToHttp().getResponse<FastifyReply>();
    const message = `Incoming request - ${statusCode} - ${method} - ${url}`;
    this.logger.log(message);

    return next.handle().pipe(
      tap({
        next: (val) => this.logNext(val, context),
        error: (err) => this.logError(err, context),
      }),
    );
  }

  private logNext(_: unknown, context: ExecutionContext): void {
    const { method, url } = context.switchToHttp().getRequest<FastifyRequest>();
    const { statusCode } = context.switchToHttp().getResponse<FastifyReply>();
    const message = `Outgoing response - ${statusCode} - ${method} - ${url}`;

    this.logger.log(message);
  }

  private logError(
    error: Error | HttpException,
    context: ExecutionContext,
  ): void {
    const { method, url } = context.switchToHttp().getRequest<FastifyRequest>();
    if (error instanceof HttpException) {
      const statusCode = error.getStatus();
      const message = `Outgoing response - ${statusCode} - ${method} - ${url}`;
      this.logger.error(message, error.stack ?? error);
    } else {
      this.logger.error(`Outgoing response - ${method} - ${url}`);
    }
  }
}
