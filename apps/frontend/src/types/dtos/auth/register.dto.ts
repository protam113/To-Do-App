import { z } from 'zod';
import { zodIsNotEmptyString } from '../utils/empty.validator';

export const RegisterUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone_number: z.string().optional(),
});

export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;

export const registerFormSchema = z.object({
  username: zodIsNotEmptyString('Username cannot be blank'),
  email: zodIsNotEmptyString('Email cannot be blank'),
  firstName: zodIsNotEmptyString('First name cannot be blank'),
  lastName: zodIsNotEmptyString('Last name cannot be blank'),
  password: zodIsNotEmptyString('Password cannot be blank'),
  phone_number: z.string().optional(),
});
