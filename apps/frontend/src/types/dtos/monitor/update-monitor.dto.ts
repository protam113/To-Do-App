import { z } from 'zod';
import { AuthConfigSchema } from './create-monitor.dto';

export const UpdateMonitorSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(200).optional(),
  url: z.string().url().optional(),
  type: z.string().max(50).optional(),
  authConfig: AuthConfigSchema.optional(),
  refreshInterval: z.number().min(5).max(3600).optional(),
});

export type UpdateMonitorDTO = z.output<typeof UpdateMonitorSchema>;
export type UpdateMonitorInput = z.input<typeof UpdateMonitorSchema>;
