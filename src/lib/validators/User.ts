import { z } from "zod";

export const newUserSchema = z.object({
  image: z.string().url().optional().nullable(),
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
