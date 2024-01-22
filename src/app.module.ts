import { Module } from '@nestjs/common';
import { ConfigurationModule } from '@configs';
import { RepositoryModule } from '@repositories';
import { JwtModule, RateLimitModule } from '@modules';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionFilter } from '@exception';
import { LoggingInterceptor, ResponseInterceptor } from '@interceptor';
import { AppController } from './app.controller';
import { AuthGuard, RateLimitGuard } from '@guards';
import { InterviewModule } from './services/interview/interview.module';
import { AccountModule } from './services/account/account.module';
import { CommentModule } from './services/comment/comment.module';
import { ChangelogModule } from './services/log/log.module';

@Module({
  imports: [
    ConfigurationModule,
    RepositoryModule,
    JwtModule,
    RateLimitModule,
    AccountModule,
    InterviewModule,
    CommentModule,
    ChangelogModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useExisting: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useExisting: RateLimitGuard,
    },
    {
      provide: APP_FILTER,
      useExisting: ExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useExisting: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useExisting: ResponseInterceptor,
    },
    AuthGuard,
    RateLimitGuard,
    ExceptionFilter,
    LoggingInterceptor,
    ResponseInterceptor,
  ],
})
export class AppModule {}
