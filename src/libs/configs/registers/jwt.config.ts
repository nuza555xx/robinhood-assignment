import { registerAs } from '@nestjs/config';
import { ConfigKeys } from '../config.eum';
import { JwtConfig } from '../config.interface';

export const jwtConfig = registerAs(ConfigKeys.JWT, (): JwtConfig => {
  return {
    secret: process.env.JWT_SECRET,
    accessTokenExpiresIn: Number(process.env.JWT_ACCESS_EXPIRATION),
    refreshTokenExpiresIn: Number(process.env.JWT_REFRESH_EXPIRATION),
  };
});
