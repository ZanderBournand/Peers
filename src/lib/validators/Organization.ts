import { z } from "zod";
import { OrganizationType } from "@prisma/client";

export const newOrgSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1).optional(),
  type: z.nativeEnum(OrganizationType),
  description: z.string().min(50),
  image: z.string().url().optional(),
});
