import { MongooseQueryOptions, mongo } from 'mongoose';

export type UpdateOptions = mongo.UpdateOptions &
  Omit<MongooseQueryOptions, 'lean'>;

export type DeleteOptions = mongo.DeleteOptions &
  Omit<MongooseQueryOptions, 'lean'>;
