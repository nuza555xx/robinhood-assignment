import {
  AggregateOptions,
  AnyKeys,
  Document,
  FilterQuery,
  InsertManyOptions,
  MergeType,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  SaveOptions,
  Types,
  UpdateQuery,
  UpdateWriteOpResult,
  mongo,
} from 'mongoose';
import { DeleteOptions, UpdateOptions } from './repository.interface';

export abstract class Repository<T> {
  abstract transaction(
    fn: (...args: any[]) => Promise<void>,
    ...args: any[]
  ): Promise<void>;

  abstract exists(filters: FilterQuery<T>): Promise<boolean>;

  abstract count(filters: FilterQuery<T>): Promise<number>;

  abstract aggregate<P>(
    pipelines: PipelineStage[],
    options?: AggregateOptions,
  ): Promise<P[]>;

  abstract findOne<U = T>(
    dto: AnyKeys<T>,
    projection?: ProjectionType<T>,
    options?: SaveOptions,
  ): Promise<U>;

  abstract findMany<U = T>(
    filters: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ): Promise<U[]>;

  abstract insertOne(dto: AnyKeys<T>, options?: SaveOptions): Promise<T>;

  abstract insertMany(
    dto: AnyKeys<T>[],
    options?: InsertManyOptions,
  ): Promise<MergeType<Document, T>[]>;

  abstract updateOne(
    filters: FilterQuery<T>,
    dto: UpdateQuery<T>,
    options?: UpdateOptions,
  ): Promise<UpdateWriteOpResult>;

  abstract updateById(
    id: Types.ObjectId,
    dto: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T>;

  abstract updateMany(
    filters: FilterQuery<T>,
    dto: UpdateQuery<T>,
    options?: UpdateOptions,
  ): Promise<UpdateWriteOpResult>;

  abstract deleteOne(
    filters: FilterQuery<T>,
    options?: DeleteOptions,
  ): Promise<mongo.DeleteResult>;

  abstract deleteById(
    id: Types.ObjectId,
    options?: QueryOptions<T>,
  ): Promise<T>;

  abstract deleteMany(
    filters: FilterQuery<T>,
    options?: DeleteOptions,
  ): Promise<mongo.DeleteResult>;
}
