import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Base } from './base.entity';
import { COLLECTION_KEYS } from '../assets';

@Schema({ timestamps: true })
export class SessionEntity extends Base {
  @Prop({
    type: String,
    ref: COLLECTION_KEYS.USER,
    required: true,
    index: true,
  })
  userId: string;

  @Prop({ type: String, required: true, unique: true })
  token: string;

  @Prop({ type: String, required: true, unique: true })
  refreshToken: string;

  @Prop({ type: Date, required: true, index: true })
  expiresAt: Date;

  @Prop({ type: String, index: true })
  deviceId?: string;

  @Prop({ type: String })
  ipAddress?: string;

  @Prop({ type: String })
  userAgent?: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export type SessionDocument = SessionEntity & Document;

export const SessionSchema = SchemaFactory.createForClass(SessionEntity);
SessionSchema.set('collection', COLLECTION_KEYS.SESSION);

SessionSchema.index({ userId: 1, isActive: 1 });
SessionSchema.index({ userId: 1, deviceId: 1 });
SessionSchema.index({ createdAt: -1 });
