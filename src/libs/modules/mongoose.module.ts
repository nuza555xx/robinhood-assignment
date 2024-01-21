import { ConfigKeys } from '@configs';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ModelDefinition,
  MongooseModule as MongooseCoreModule,
  MongooseModuleFactoryOptions,
} from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseCoreModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get<MongooseModuleFactoryOptions>(ConfigKeys.MONGOOSE),
      inject: [ConfigService],
    }),
  ],
})
export class MongooseModule {
  static forFeature(models: ModelDefinition[]): DynamicModule {
    return {
      module: MongooseModule,
      imports: [MongooseCoreModule.forFeature(models)],
      exports: [MongooseCoreModule],
    };
  }
}
