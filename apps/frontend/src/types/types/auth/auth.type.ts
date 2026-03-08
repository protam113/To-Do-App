import z from 'zod';

export interface RegisterData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  verified: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface RegisterAccountData {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>;
