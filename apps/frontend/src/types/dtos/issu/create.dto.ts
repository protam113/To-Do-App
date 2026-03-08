import { z } from 'zod';

const MediaObjectSchema = z.object({
  id: z.string().min(1, 'Media ID is required'),
  url: z.string().url('Invalid URL'),
  fileName: z.string().optional(),
  originalName: z.string().optional(),
  mimeType: z.string().optional(),
  fileType: z.string().optional(),
});

export const CreateIssuSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  expiresAt: z.string().min(1, 'Expires date is required'), // Keep as string for API
  medias: z
    .array(MediaObjectSchema)
    .max(10, 'Maximum 10 media files')
    .default([]),
});

export type CreateIssuDTO = z.infer<typeof CreateIssuSchema>;
