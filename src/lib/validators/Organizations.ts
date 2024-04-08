import { z } from "zod";

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
});
