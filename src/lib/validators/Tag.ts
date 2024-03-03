import { z } from "zod";

export const TagSchema = z.object({
  id: z.string(),
  category: z.string(),
  name: z.string(),
});
