import { z } from 'zod';

const ReportSeverityValues = ['low', 'medium', 'high', 'critical'] as const;
const ReportStatusValues = [
  'open',
  'in_progress',
  'resolved',
  'canceled',
] as const;
const ReportTypeValues = ['incident', 'daily', 'weekly'] as const;

export const AttachmentInputSchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  fileName: z.string().optional(),
  originalName: z.string().optional(),
  mimeType: z.string().optional(),
  fileType: z.string().optional(),
});

export const CreateReportSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  error: z.array(z.string()).optional().default([]),
  severity: z
    .string()
    .transform((val) => val.toLowerCase())
    .pipe(
      z.enum(ReportSeverityValues, {
        message: `Severity must be one of: ${ReportSeverityValues.join(', ')}`,
      })
    ),
  status: z
    .string()
    .transform((val) => val.toLowerCase())
    .pipe(z.enum(ReportStatusValues))
    .optional()
    .default('open'),
  incidentTime: z.string().optional(),
  attachments: z.array(AttachmentInputSchema).optional(),
});

export type CreateReportDTO = z.output<typeof CreateReportSchema>;
export type CreateReportInput = z.input<typeof CreateReportSchema>;
