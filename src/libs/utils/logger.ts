import { inspect } from 'util';
import { ConsoleLogger, ConsoleLoggerOptions, LogLevel } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  private static Levels: LogLevel[] =
    process.env.NODE_ENV === 'production'
      ? ['log', 'error', 'warn']
      : ['log', 'error', 'warn', 'debug', 'verbose'];
  private timer: Record<string, number> = {};

  constructor(
    context?: string,
    options: ConsoleLoggerOptions = {
      logLevels: CustomLogger.Levels,
      timestamp: true,
    },
  ) {
    super(context, options);
  }

  formatContext(context?: unknown, time?: number): string {
    const timeContext = time ? `+${time}ms` : '';

    return `${
      context ? `${context as string}` : `[${this.context}]`
    } ${timeContext}`;
  }

  log(message: any, context?: unknown): void {
    super.log(message, this.formatContext(context));
  }

  error(message: any, context?: unknown): void {
    super.error(
      message instanceof Error
        ? inspect({
            name: message.name,
            message: message.name,
            stack: message.stack,
          })
        : inspect(message),
      '',
      this.formatContext(context),
    );
  }

  warn(message: any, context?: unknown): void {
    super.warn(message, this.formatContext(context));
  }

  time(message: any, context?: string): void {
    this.timer[JSON.stringify({ context, message })] = Date.now();
  }

  timeEnd(message: any, context?: string): void {
    const afterMs = Date.now();
    const beforeMs = this.timer[JSON.stringify({ context, message })];

    if (!beforeMs) return;

    const time = afterMs - beforeMs;

    delete this.timer[JSON.stringify({ context, message })];

    super.log(message, this.formatContext(context, time));
  }
}
