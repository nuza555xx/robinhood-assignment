import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  AggregateOptions,
  AnyKeys,
  Connection,
  Document,
  FilterQuery,
  InsertManyOptions,
  MergeType,
  Model,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  SaveOptions,
  Types,
  UpdateQuery,
  UpdateWriteOpResult,
  mongo,
} from 'mongoose';
import { Changelog } from '../schemas';
import { Repository } from '../repository.abstract';
import { isObject } from 'class-validator';
import { DeleteOptions, UpdateOptions } from '../repository.interface';

export class ChangelogImplement implements Repository<Changelog> {
  constructor(
    @InjectModel(Changelog.name)
    private readonly model: Model<Changelog>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async transaction(
    fn: (...args: any[]) => Promise<void>,
    ...args: any[]
  ): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await fn(...args);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  aggregate<T>(
    pipelines: PipelineStage[],
    options?: AggregateOptions,
  ): Promise<T[]> {
    return this.model.aggregate(pipelines, options).exec();
  }

  async exists(filters: FilterQuery<Changelog>): Promise<boolean> {
    const exists = await this.model.exists(filters).exec();
    return isObject(exists);
  }

  async count(filters: FilterQuery<Changelog>): Promise<number> {
    return this.model.countDocuments(filters).exec();
  }

  findOne<T>(
    filters: FilterQuery<Changelog>,
    projection?: ProjectionType<Changelog>,
    options?: QueryOptions,
  ): Promise<T> {
    return this.model.findOne(filters, projection, options);
  }

  findMany<T>(
    filters: FilterQuery<Changelog>,
    projection?: ProjectionType<Changelog>,
    options?: QueryOptions,
  ): Promise<T[]> {
    return this.model.find(filters, projection, options);
  }

  insertOne(
    dto: AnyKeys<Changelog>,
    options?: SaveOptions,
  ): Promise<Changelog> {
    const create = new this.model(dto);
    return create.save(options);
  }

  insertMany(
    dto: AnyKeys<Changelog>[],
    options?: InsertManyOptions,
  ): Promise<MergeType<Document, Changelog>[]> {
    return this.model.insertMany(dto, options);
  }

  updateOne(
    filters: FilterQuery<Changelog>,
    dto: UpdateQuery<Changelog>,
    options?: UpdateOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.model.updateOne(filters, dto, options).exec();
  }

  updateById(
    id: Types.ObjectId,
    dto: UpdateQuery<Changelog>,
    options?: QueryOptions<Changelog>,
  ): Promise<Changelog> {
    return this.model.findByIdAndUpdate(id, dto, options).exec();
  }

  updateMany(
    filters: FilterQuery<Changelog>,
    dto: UpdateQuery<Changelog>,
    options?: UpdateOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.model.updateMany(filters, dto, options).exec();
  }

  deleteOne(
    filters: FilterQuery<Changelog>,
    options?: DeleteOptions,
  ): Promise<mongo.DeleteResult> {
    return this.model.deleteOne(filters, options).exec();
  }

  deleteById(
    id: Types.ObjectId,
    options?: QueryOptions<Changelog>,
  ): Promise<Changelog> {
    return this.model.findByIdAndDelete(id, options).exec();
  }

  deleteMany(
    filters: FilterQuery<Changelog>,
    options?: DeleteOptions,
  ): Promise<mongo.DeleteResult> {
    return this.model.deleteMany(filters, options).exec();
  }
}
