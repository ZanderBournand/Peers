import { z } from "zod";

export const newOrgSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1).optional(),
  type: z.string().min(1),
  description: z.string().min(50),
  image: z.string().url().optional(),
  instagram: z.string().min(1).optional(),
  discord: z.string().min(1).optional(),
  facebook: z.string().min(1).optional(),
});
