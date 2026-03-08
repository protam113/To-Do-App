import { z } from 'zod';

export const AttachmentSchema = z
  .object({
    id: z.string().min(1, 'Attachment ID is required'),
    url: z.string().url('Invalid URL format'),
    fileName: z.string().optional(),
    originalName: z.string().optional(),
    mimeType: z.string().optional(),
    fileType: z.string().optional(),
    size: z.number().optional(),
  })
  .passthrough();

export const AttachmentsArraySchema = z
  .array(AttachmentSchema)
  .min(1, 'At least one attachment is required');

export type AttachmentDTO = z.infer<typeof AttachmentSchema>;
