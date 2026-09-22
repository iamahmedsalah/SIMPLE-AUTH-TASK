import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, type Types } from 'mongoose';

export enum AuthTokenType {
  EmailVerification = 'EMAIL_VERIFICATION',
  PasswordReset = 'PASSWORD_RESET',
}

export type AuthTokenDocument = HydratedDocument<AuthToken>;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, versionKey: false })
export class AuthToken {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true, select: false })
  tokenHash: string;

  @Prop({ required: true, enum: AuthTokenType })
  type: AuthTokenType;

  @Prop({ required: true, type: Date, expires: 0 })
  expiresAt: Date;

  createdAt: Date;
}

export const AuthTokenSchema = SchemaFactory.createForClass(AuthToken);
AuthTokenSchema.index({ userId: 1, type: 1 });
