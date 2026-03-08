import { z } from 'zod';

export const CreateMediaSchema = z.object({
  originalName: z.string().min(1, 'Name is required'),
  mimeType: z.string().min(1, 'Type is required'),
  size: z.number().positive('Size must be positive'),
});

export type CreateMediaDTO = z.infer<typeof CreateMediaSchema>;
