import { z } from "zod";
import { OrganizationType } from "@prisma/client";

export const newOrgSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(OrganizationType),
  university: z.string().min(1).optional().nullable(),
  description: z.string().min(50),
  image: z.string().url(),
  email: z.string().min(1),
  instagram: z.string().min(1).optional().nullable(),
  discord: z.string().min(1).optional().nullable(),
  facebook: z.string().min(1).optional().nullable(),
});
