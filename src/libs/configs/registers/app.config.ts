import { registerAs } from '@nestjs/config';
import { ConfigKeys } from '../config.eum';

export interface AppConfig {
  projectName: string;
  version: string;
  environment: string;
  port: number;
  cors: string[];
}

export const appConfig = registerAs(ConfigKeys.APP, (): AppConfig => {
  return {
    projectName: 'Interview API',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    cors: process.env.CORS_ORIGIN?.split(',') ?? ['*'],
    port: 80,
  };
});
