import { ConfigProvider, JwtConfig } from '@configs';
import { Exception } from '@exception';
import {
  CanActivate,
  CustomDecorator,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account, Repository, RepositoryProvider } from '@repositories';
import { Token } from '@utils/token';
import { FastifyRequest } from 'fastify';
import { Types } from 'mongoose';

import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);

export interface AuthRequest extends FastifyRequest {
  $account: Account;
}

interface TokenPayload {
  id: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(RepositoryProvider.ACCOUNT)
    private readonly accountRepo: Repository<Account>,

    @Inject(ConfigProvider.JWT)
    private readonly jwtConfig: JwtConfig,

    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = Token.getAccessTokenByCookie(request);

    if (!token) throw new Exception('MISSING_AUTHORIZATION_HEADERS');

    const payload = this.verifyToken(token);

    if (!payload) throw new Exception('INVALID_ACCESS_TOKEN');

    const id = payload.id;
    const account = await this.accountRepo.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!account) throw new Exception('INVALID_ACCESS_TOKEN');

    request.$account = account;

    return true;
  }

  private verifyToken(token: string): TokenPayload {
    return this.jwtService.verify(token, {
      secret: this.jwtConfig.secret,
    });
  }
}
