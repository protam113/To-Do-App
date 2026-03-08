import { z } from 'zod';

const ReportSeverityValues = ['low', 'medium', 'high', 'critical'] as const;
const ReportStatusValues = [
  'open',
  'in_progress',
  'resolved',
  'canceled',
] as const;
const ReportTypeValues = ['incident', 'daily', 'weekly'] as const;

export const UpdateReportSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(200).optional(),
  description: z.string().max(1000).optional(),
  severity: z.preprocess(
    (val) => (typeof val === 'string' ? val.toLowerCase() : val),
    z.enum(ReportSeverityValues).optional()
  ),
  type: z.preprocess(
    (val) => (typeof val === 'string' ? val.toLowerCase() : val),
    z.enum(ReportTypeValues).optional()
  ),
  status: z.preprocess(
    (val) => (typeof val === 'string' ? val.toLowerCase() : val),
    z.enum(ReportStatusValues).optional()
  ),
});

export type UpdateReportDTO = z.output<typeof UpdateReportSchema>;
export type UpdateReportInput = z.input<typeof UpdateReportSchema>;

export const UpdateReportStatusSchema = z.object({
  status: z.string().optional(),
});

export type UpdateReportStatusDTO = z.infer<typeof UpdateReportStatusSchema>;
