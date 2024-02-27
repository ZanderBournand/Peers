import { z } from "zod";

export const eduEmailSchema = (domains: string[]) =>
  z.object({
    eduEmail: z
      .string()
      .email()
      .refine((email) => {
        return domains.some((domain) => email.endsWith(domain));
      }, "Email domain must correspond to the selected institution"),
  });
