/*
  File -> Form validator used for new tag creation / updates
*/

import { z } from "zod";
import { TagCategory } from "@prisma/client";

export const TagSchema = z.object({
  id: z.string(),
  category: z.nativeEnum(TagCategory),
  name: z.string(),
});
