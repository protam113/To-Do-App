import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_@.-]+$/;

export const LogInSchema = z.object({
    username: z
        .string()
        .min(1)
        .refine(
            (val) => emailRegex.test(val) || usernameRegex.test(val),
            "username must be a valid username or email"
        ),

    password: z.string().min(1),

});

export type LogInDTO = z.infer<typeof LogInSchema>;
