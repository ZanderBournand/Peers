import { z } from "zod";
import { TagSchema } from "./Tag";

export const newUserSchema = z.object({
  image: z.string().url(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  interests: TagSchema.array().min(1),
  bio: z.string().min(100).max(500),
  github: z.string().url().optional().nullable(),
  linkedin: z.string().url().optional().nullable(),
  website: z.string().url().optional().nullable(),
});
