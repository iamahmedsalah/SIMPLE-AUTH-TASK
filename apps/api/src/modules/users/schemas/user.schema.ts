import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, trim: true, minlength: 3, maxlength: 80 })
  name: string;

  @Prop({ required: true, lowercase: true, trim: true, unique: true, index: true, maxlength: 254 })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ type: Date, default: null })
  emailVerifiedAt: Date | null;

  @Prop({ required: true, default: 0, select: false })
  authVersion: number;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
