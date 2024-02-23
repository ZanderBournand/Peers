import { z } from "zod";

export const newUserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  skills: z
    .object({ name: z.string().min(1) })
    .array()
    .min(1),
  bio: z.string().min(100).max(500),
  github: z.string(),
  linkedin: z.string(),
  website: z.union([z.literal(""), z.string().trim().url()]),
});

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  skills: z.string().array(),
  bio: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  isVerifiedStudent: z.boolean(),
});
