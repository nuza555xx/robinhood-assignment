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
import { Comment } from '../schemas';
import { Repository } from '../repository.abstract';
import { isObject } from 'class-validator';
import { DeleteOptions, UpdateOptions } from '../repository.interface';

export class CommentImplement implements Repository<Comment> {
  constructor(
    @InjectModel(Comment.name)
    private readonly model: Model<Comment>,
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

  async exists(filters: FilterQuery<Comment>): Promise<boolean> {
    const exists = await this.model.exists(filters).exec();
    return isObject(exists);
  }

  async count(filters: FilterQuery<Comment>): Promise<number> {
    return this.model.countDocuments(filters).exec();
  }

  findOne<T>(
    filters: FilterQuery<Comment>,
    projection?: ProjectionType<Comment>,
    options?: QueryOptions,
  ): Promise<T> {
    return this.model.findOne(filters, projection, options);
  }

  findMany<T>(
    filters: FilterQuery<Comment>,
    projection?: ProjectionType<Comment>,
    options?: QueryOptions,
  ): Promise<T[]> {
    return this.model.find(filters, projection, options);
  }

  insertOne(dto: AnyKeys<Comment>, options?: SaveOptions): Promise<Comment> {
    const create = new this.model(dto);
    return create.save(options);
  }

  insertMany(
    dto: AnyKeys<Comment>[],
    options?: InsertManyOptions,
  ): Promise<MergeType<Document, Comment>[]> {
    return this.model.insertMany(dto, options);
  }

  updateOne(
    filters: FilterQuery<Comment>,
    dto: UpdateQuery<Comment>,
    options?: UpdateOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.model.updateOne(filters, dto, options).exec();
  }

  updateById(
    id: Types.ObjectId,
    dto: UpdateQuery<Comment>,
    options?: QueryOptions<Comment>,
  ): Promise<Comment> {
    return this.model.findByIdAndUpdate(id, dto, options).exec();
  }

  updateMany(
    filters: FilterQuery<Comment>,
    dto: UpdateQuery<Comment>,
    options?: UpdateOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.model.updateMany(filters, dto, options).exec();
  }

  deleteOne(
    filters: FilterQuery<Comment>,
    options?: DeleteOptions,
  ): Promise<mongo.DeleteResult> {
    return this.model.deleteOne(filters, options).exec();
  }

  deleteById(
    id: Types.ObjectId,
    options?: QueryOptions<Comment>,
  ): Promise<Comment> {
    return this.model.findByIdAndDelete(id, options).exec();
  }

  deleteMany(
    filters: FilterQuery<Comment>,
    options?: DeleteOptions,
  ): Promise<mongo.DeleteResult> {
    return this.model.deleteMany(filters, options).exec();
  }
}
