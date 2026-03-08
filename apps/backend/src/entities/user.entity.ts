import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Document } from 'mongoose';
import { Base } from './base.entity';
import { COLLECTION_KEYS } from '../assets';
import { RefreshTokenSession } from '../types';
import { WorkerPoolService } from '../modules/worker';

@Schema({ timestamps: true })
export class UserEntity extends Base {
  @Prop({ trim: true })
  fullName: string;

  @Prop({ default: () => new Date() })
  lastLogin: Date;

  @Prop({ unique: true, sparse: true })
  readonly username?: string;

  @Prop({ unique: true, trim: true, lowercase: true })
  readonly email: string;


  @Prop({ required: false, select: false })
  password?: string;

  @Prop({ default: false })
  isActive: boolean;


  // --- Soft delete fields ---
  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ required: false })
  deletedAt?: Date;

  // user.entity.ts
  @Prop({
    type: [
      {
        token: { type: String, select: false },
        deviceId: String,
        deviceName: String,
        ipAddress: String,
        lastUsed: { type: Date, default: Date.now },
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date },
      },
    ],
    default: [],
    select: false,
    validate: {
      validator: function (v: any[]) {
        return v.length <= 10;
      },
      message: 'Maximum 10 devices allowed',
    },
  })
  refreshTokens?: RefreshTokenSession[];
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
UserSchema.set('collection', COLLECTION_KEYS.USER);

let workerPoolServiceInstance: WorkerPoolService | null = null;

export function setWorkerPoolService(service: WorkerPoolService): void {
  workerPoolServiceInstance = service;
}

export function getWorkerPoolService(): WorkerPoolService | null {
  return workerPoolServiceInstance;
}

UserSchema.pre<UserDocument>('save', async function () {
  if (this.isModified('password') && this.password) {
    if (workerPoolServiceInstance) {
      // Use worker thread for password hashing (non-blocking)
      this.password = await workerPoolServiceInstance.hashPassword(
        this.password
      );
    } else {
      // Fallback to direct argon2 if worker pool not initialized
      this.password = await argon2.hash(this.password, {
        type: argon2.argon2id,
        timeCost: 2,
        memoryCost: 19456, // 19 MB
        parallelism: 1,
      });
    }
  }
});

UserSchema.methods.comparePassword = async function (
  attempt: string
): Promise<boolean> {
  if (!attempt || !this.password) return false;
  if (workerPoolServiceInstance) {
    return workerPoolServiceInstance.verifyPassword(this.password, attempt);
  }
  return argon2.verify(this.password, attempt);
};

export interface UserDocument extends Document<string> {
  _id: string;
  fullName: string;
  username?: string;
  email: string;
  password?: string;
  lastLogin: Date;
  isActive: boolean;
  isBlocked: boolean;
  verified: boolean;
  isDeleted: boolean;
  deletedAt?: Date;

  refreshTokens?: RefreshTokenSession[];
  comparePassword(attempt: string): Promise<boolean>;
}
