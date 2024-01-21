import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document } from 'mongoose';

@Schema({ id: false, _id: false, versionKey: false })
export class Avatar {
  @Prop({ type: SchemaTypes.String })
  thumbnail?: string;

  @Prop({ type: SchemaTypes.String })
  original?: string;
}

const AvatarSchema = SchemaFactory.createForClass(Avatar);

@Schema({ timestamps: true })
export class Account extends Document {
  @Prop({ type: SchemaTypes.String, index: true, required: true, unique: true })
  username: string;

  @Prop({ type: SchemaTypes.String, required: true })
  password: string;

  @Prop({ type: SchemaTypes.String, required: true, unique: true })
  displayName: string;

  @Prop({ type: AvatarSchema, required: true })
  avatar: Avatar;
}

export const AccountSchema = SchemaFactory.createForClass(Account)
  .index({ username: 1 }, { background: true })
  .index({ role: 1 }, { background: true });
