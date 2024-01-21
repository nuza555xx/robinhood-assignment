import { CommentStatus } from '@enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { Account } from './account.schema';
import { Interview } from './interview.schema';

@Schema({ timestamps: true })
export class Comment<ID = Types.ObjectId> extends Document {
  @Prop({ type: SchemaTypes.String, required: true })
  content: string;

  @Prop({
    type: SchemaTypes.String,
    enum: CommentStatus,
    default: CommentStatus.PUBLISH,
  })
  status: CommentStatus;

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

export const CommentSchema = SchemaFactory.createForClass(Comment).index(
  { createdBy: 1 },
  { background: true },
);
