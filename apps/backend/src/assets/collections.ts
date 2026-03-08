import * as dotenv from 'dotenv';
dotenv.config();

export const COLLECTION_KEYS = {
  PROJECT: process.env.PROJECT_COLLECTION || 'projcets',
  TASK: process.env.TASK_COLLECTION || 'tasks',
  USER: process.env.USER_COLLECTION || 'users',
  SESSION: process.env.SESSION_COLLECTION || 'sessions',

};
