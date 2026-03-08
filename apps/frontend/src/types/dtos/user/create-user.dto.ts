import { z } from "zod";

/**
 * Local user (usual signup)
 */
export const CreateUserLocalSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(1),
    username: z.string().min(1),
});
export type CreateUserLocalDto = z.infer<typeof CreateUserLocalSchema>;

/**
 * Google OAuth signup
 * - `verified` coerced to boolean if request sends string "true"/"false"
 */
export const CreateUserGoogleSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    sub: z.string().min(1),
    provider: z.string().min(1),
    providerId: z.string().min(1),
    // accept boolean or string "true"/"false"
    verified: z.preprocess(
        (v) => (typeof v === "string" ? v === "true" : v),
        z.boolean()
    ),
});
export type CreateUserGoogleDto = z.infer<typeof CreateUserGoogleSchema>;

/**
 * Github OAuth signup
 */
export const CreateUserGithubSchema = z.object({
    username: z.string().min(1),
    email: z.string().email().optional(),
    provider: z.string().min(1),
    providerId: z.string().min(1),
    // same coercion as above
    verified: z.preprocess(
        (v) => (typeof v === "string" ? v === "true" : v),
        z.boolean()
    ),
});
export type CreateUserGithubDto = z.infer<typeof CreateUserGithubSchema>;
