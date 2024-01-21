import { Exception } from '@exception';
import { FastifyRequest } from 'fastify';

export class Token {
  static getAccessTokenByCookie(request: FastifyRequest): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (!type) throw new Exception('MISSING_AUTHORIZATION_HEADERS');

    return token;
  }
}
