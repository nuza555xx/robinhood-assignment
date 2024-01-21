import { ErrorsCode } from '@exception';
import { AuthGuard, AuthRequest } from '@guards';
import {
  ExecutionContext,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { ApiCookieAuth, ApiResponse } from '@nestjs/swagger';
import { Account } from '@repositories';

export class Authorizer {
  constructor(public account: Account) {}
}

export const Auth = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    const account = await request.$account;
    return new Authorizer(account);
  },
);

export const Authorize = () => {
  return applyDecorators(
    ApiResponse({
      status: ErrorsCode['MISSING_AUTHORIZATION_HEADERS'].statusCode,
      description: ErrorsCode['MISSING_AUTHORIZATION_HEADERS'].message,
    }),
    ApiCookieAuth('JSON Web Token Authorization'),
    UseGuards(AuthGuard),
  );
};
