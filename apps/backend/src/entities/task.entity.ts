import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base } from './base.entity';
import { Document } from 'mongoose';
import { COLLECTION_KEYS } from '../assets';
import { TaskSeverity, TaskStatus, UserActionType } from '../types';

@Schema({ timestamps: true })
export class TaskEntity extends Base {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  content?: string;

  @Prop({ type: [String], ref: 'ErrorEntity', default: [] })
  error: string[];

  @Prop({
    type: String,
    required: true,
    enum: TaskSeverity,
  })
  severity: TaskSeverity;

  @Prop({
    type: [
      {
        type: { type: String, enum: UserActionType, required: true },
        userId: { type: String, ref: 'UserEntity', required: true },
        actionAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
    _id: false,
  })
  users: {
    type: UserActionType;
    userId: string;
    actionAt: Date;
  }[];

  @Prop({
    type: String,
    required: true,
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status: TaskStatus;

  @Prop({ required: false, type: String })
  incidentTime?: string;

  @Prop({
    type: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
        fileName: { type: String },
        originalName: { type: String },
        mimeType: { type: String },
        fileType: { type: String },
      },
    ],
    default: [],
  })
  attachments: Array<{
    id: string;
    url: string;
    fileName?: string;
    originalName?: string;
    mimeType?: string;
    fileType?: string;
  }>;

  // --- Soft delete fields ---
  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ required: false })
  deletedAt?: Date;
}

export type TaskDocument = TaskEntity & Document;

export const TaskSchema = SchemaFactory.createForClass(TaskEntity);
TaskSchema.set('collection', COLLECTION_KEYS.TASK);
