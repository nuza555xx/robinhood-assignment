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
import { Interview } from '../schemas';
import { Repository } from '../repository.abstract';
import { isObject } from 'class-validator';
import { DeleteOptions, UpdateOptions } from '../repository.interface';

export class InterviewImplement implements Repository<Interview> {
  constructor(
    @InjectModel(Interview.name) private readonly model: Model<Interview>,
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
    return this.model.aggregate(pipelines, options);
  }

  async exists(filters: FilterQuery<Interview>): Promise<boolean> {
    const exists = await this.model.exists(filters);
    return isObject(exists);
  }

  async count(filters: FilterQuery<Interview>): Promise<number> {
    return this.model.countDocuments(filters);
  }

  findOne<T>(
    filters: FilterQuery<Interview>,
    projection?: ProjectionType<Interview>,
    options?: QueryOptions,
  ): Promise<T> {
    return this.model.findOne(filters, projection, options);
  }

  findMany<T>(
    filters: FilterQuery<Interview>,
    projection?: ProjectionType<Interview>,
    options?: QueryOptions,
  ): Promise<T[]> {
    return this.model.find(filters, projection, options);
  }

  insertOne(
    dto: AnyKeys<Interview>,
    options?: SaveOptions,
  ): Promise<Interview> {
    const create = new this.model(dto);
    return create.save(options);
  }

  insertMany(
    dto: AnyKeys<Interview>[],
    options?: InsertManyOptions,
  ): Promise<MergeType<Document, Interview>[]> {
    return this.model.insertMany(dto, options);
  }

  updateOne(
    filters: FilterQuery<Interview>,
    dto: UpdateQuery<Interview>,
    options?: UpdateOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.model.updateOne(filters, dto, options);
  }

  updateById(
    id: Types.ObjectId,
    dto: UpdateQuery<Interview>,
    options?: QueryOptions<Interview>,
  ): Promise<Interview> {
    return this.model.findByIdAndUpdate(id, dto, options);
  }

  updateMany(
    filters: FilterQuery<Interview>,
    dto: UpdateQuery<Interview>,
    options?: UpdateOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.model.updateMany(filters, dto, options);
  }

  deleteOne(
    filters: FilterQuery<Interview>,
    options?: DeleteOptions,
  ): Promise<mongo.DeleteResult> {
    return this.model.deleteOne(filters, options);
  }

  deleteById(
    id: Types.ObjectId,
    options?: QueryOptions<Interview>,
  ): Promise<Interview> {
    return this.model.findByIdAndDelete(id, options);
  }

  deleteMany(
    filters: FilterQuery<Interview>,
    options?: DeleteOptions,
  ): Promise<mongo.DeleteResult> {
    return this.model.deleteMany(filters, options);
  }
}
