import { z } from "zod";

export const eduEmail = z.object({
  eduEmail: z.string().email().refine((email) => {
    return email.endsWith(".edu");
  }, "Email must be a .edu email"),
});