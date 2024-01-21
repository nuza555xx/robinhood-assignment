export interface JwtConfig {
  secret: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}
