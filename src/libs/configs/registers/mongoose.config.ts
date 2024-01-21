import { registerAs } from '@nestjs/config';
import { ConfigKeys } from '../config.eum';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const mongooseConfig = registerAs(
  ConfigKeys.MONGOOSE,
  (): MongooseModuleFactoryOptions => {
    return {
      dbName: process.env.DB_DATABASE_NAME,
      uri: `mongodb://${
        process.env.DB_USERNAME && process.env.DB_PASSWORD
          ? `${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@`
          : ''
      }${process.env.DB_HOST}`,
    };
  },
);
