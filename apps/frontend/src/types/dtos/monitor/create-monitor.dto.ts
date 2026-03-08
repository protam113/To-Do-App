import { z } from 'zod';

export const AuthConfigSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  token: z.string().optional(),
  apiKey: z.string().optional(),
});

export const CreateMonitorSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  url: z.string().url().optional(),
  type: z.string().max(50).optional(),
  authConfig: AuthConfigSchema.optional(),
  refreshInterval: z.number().min(5).max(3600).optional().default(30),
});

export type CreateMonitorDTO = z.output<typeof CreateMonitorSchema>;
export type CreateMonitorInput = z.input<typeof CreateMonitorSchema>;
