import { z } from "zod";
import { OrgType } from "@prisma/client";

export const newOrgSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1).optional().nullable(),
  university: z.string().min(1).optional().nullable(),
  type: z.nativeEnum(OrgType),
  description: z.string().min(50),
  image: z.string().url().optional().nullable(),
  instagram: z.string().min(1).optional().nullable(),
  discord: z.string().min(1).optional().nullable(),
  facebook: z.string().min(1).optional().nullable(),
});
