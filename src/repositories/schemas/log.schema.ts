import { InterviewStatus } from '@enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { Account } from './account.schema';
import { Interview } from './interview.schema';

@Schema({ timestamps: true })
export class Changelog<ID = Types.ObjectId> extends Document {
  @Prop({ type: SchemaTypes.String, required: true })
  title: string;

  @Prop({ type: SchemaTypes.String, required: true })
  description: string;

  @Prop({
    type: SchemaTypes.String,
    enum: InterviewStatus,
  })
  status: InterviewStatus;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: Interview.name })
  refBy: Types.ObjectId;

  @Prop({ type: SchemaTypes.Date })
  createdAt: Date;

  @Prop({ type: SchemaTypes.Date })
  updatedAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: Account.name })
  createdBy: ID;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: Account.name })
  updatedBy: ID;
}

export const ChangelogSchema = SchemaFactory.createForClass(Changelog);
