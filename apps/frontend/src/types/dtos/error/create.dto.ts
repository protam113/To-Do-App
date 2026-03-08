import { z } from 'zod';
import { zodIsNotEmptyString } from '../utils/empty.validator';

export const createErrorFormSchema = z.object({
  name: zodIsNotEmptyString('Type name cannot be blank'),
});

export type CreateErrorDTO = z.infer<typeof createErrorFormSchema>;

export const createTypeFormSchema = z.object({
  name: zodIsNotEmptyString('Type name cannot be blank'),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type CreateTypeBySlugDTO = z.infer<typeof createTypeFormSchema>;

export const updateTypeFormSchema = z.object({
  name: zodIsNotEmptyString('Type name cannot be blank'),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type UpdateTypeBySlugDTO = z.infer<typeof updateTypeFormSchema>;
