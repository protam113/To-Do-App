import { z } from 'zod';

const MediaObjectSchema = z.object({
  id: z.string().min(1, 'Media ID is required'),
  url: z.string().url('Invalid URL'),
  fileName: z.string().optional(),
  originalName: z.string().optional(),
  mimeType: z.string().optional(),
  fileType: z.string().optional(),
});

export const UpdateIssueMediasSchema = z.object({
  medias: z
    .array(MediaObjectSchema)
    .max(10, 'Maximum 10 media files')
    .min(0, 'Medias array cannot be negative'),
});

export type UpdateIssueMediasDTO = z.infer<typeof UpdateIssueMediasSchema>;
