import { z } from 'zod';
import { zodIsNotEmptyString } from '../utils/empty.validator';

export const BlockedUsersSchema = z.object({
  userIds: z.array(z.string().min(1)).min(1),
});

export type BlockedUsersDTO = z.infer<typeof BlockedUsersSchema>;

export const blockUsersFormSchema = z.object({
  userIds: z
    .array(zodIsNotEmptyString('UserId cannot be blank'))
    .min(1, 'At least one user must be selected')
    .refine((arr) => new Set(arr).size === arr.length, {
      message: 'Duplicate userIds are not allowed',
    }),
});

export const UpdateAvatarSchema = z.object({
  avatarUrl: z
    .string()
    .url('Invalid URL format')
    .min(1, 'Avatar URL is required'),
});

export type UpdateAvatarDTO = z.infer<typeof UpdateAvatarSchema>;

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone_number: z.string().optional(),
});

export type UpdateProfileDTO = z.infer<typeof UpdateProfileSchema>;
