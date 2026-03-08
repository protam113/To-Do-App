import { z } from 'zod';
import { TicketType } from '@/types';

export const CreateTicketSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.nativeEnum(TicketType),
  userId: z.string().optional(), // Optional for anonymous users
});

export type CreateTicketDTO = z.infer<typeof CreateTicketSchema>;
