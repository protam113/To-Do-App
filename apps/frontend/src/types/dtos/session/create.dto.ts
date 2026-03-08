import { z } from 'zod';

export const CreateSessionSchema = z.object({
  userId: z.string().min(1, 'userId cannot be empty'),
  token: z.string().min(1, 'token cannot be empty'),
  refreshToken: z.string().min(1, 'refreshToken cannot be empty'),
  expiresAt: z.coerce.date(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export type CreateSessionDto = z.infer<typeof CreateSessionSchema>;
