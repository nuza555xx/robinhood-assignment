import { ConfigKeys, JwtConfig } from '@configs';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule as JwtCoreModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtCoreModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get<JwtConfig>(ConfigKeys.JWT);
        return {
          secret: config.secret,
          signOptions: { expiresIn: config.accessTokenExpiresIn },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [JwtCoreModule],
})
export class JwtModule {}
