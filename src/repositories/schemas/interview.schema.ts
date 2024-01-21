import { InterviewStatus } from '@enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { Account } from './account.schema';

@Schema({ timestamps: true })
export class Interview<ID = Types.ObjectId> extends Document {
  @Prop({ type: SchemaTypes.String, required: true })
  title: string;

  @Prop({ type: SchemaTypes.String, required: true })
  description: string;

  @Prop({
    type: SchemaTypes.String,
    enum: InterviewStatus,
    default: InterviewStatus.TODO,
  })
  status: InterviewStatus;

  @Prop({ type: SchemaTypes.Boolean, default: false })
  isArchive: boolean;

  @Prop({ type: SchemaTypes.Date })
  createdAt: Date;

  @Prop({ type: SchemaTypes.Date })
  updatedAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: Account.name })
  createdBy: ID;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: Account.name })
  updatedBy: ID;
}

export const InterviewSchema = SchemaFactory.createForClass(Interview)
  .index({ title: 'text', description: 'text' }, { background: true })
  .index({ isArchive: 1, createdBy: 1 }, { background: true });
