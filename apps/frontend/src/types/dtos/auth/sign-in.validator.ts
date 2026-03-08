import { z } from 'zod';
import { zodIsNotEmptyString } from '../utils/empty.validator';

export const loginFormSchema = z.object({
    username: zodIsNotEmptyString('Username cannot be blank'),

    password: zodIsNotEmptyString('Password cannot be blank').refine(
        (val) => val.length >= 8,
        {
            message: 'Password must be at least 8 characters',
        }
    ),
});
