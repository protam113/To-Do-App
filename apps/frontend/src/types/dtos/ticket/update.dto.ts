import { z } from 'zod';
import { TiketStatus } from '@/types';

export const UpdateTicketSchema = z.object({
  status: z
    .string()
    .refine((val) => Object.values(TiketStatus).includes(val as TiketStatus), {
      message: `Status must be one of: ${Object.values(TiketStatus).join(
        ', '
      )}`,
    }),
  rejectionReason: z.string().optional(),
});

export type UpdateTicketDTO = z.infer<typeof UpdateTicketSchema>;
