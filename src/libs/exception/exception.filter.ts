import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as ExceptionCoreFilter,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Exception } from './exception';

@Catch(Exception)
export class ExceptionFilter implements ExceptionCoreFilter {
  private logger = new Logger(ExceptionFilter.name);

  catch(exception: Exception, host: ArgumentsHost): FastifyReply {
    const exceptionHTTP = exception.getLocalizedException();
    const context = host.switchToHttp();
    const statusCode = exceptionHTTP.getStatus();
    this.logger.error(exceptionHTTP?.stack ?? exception.stack);

    return context
      .getResponse<FastifyReply>()
      .status(statusCode)
      .send(exceptionHTTP.getResponse());
  }
}
