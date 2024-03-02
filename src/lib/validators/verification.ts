import { z } from "zod";

export const verifyCodeSchema = z.object({
  verifyCode: z
    .string()
    .length(6, "The code must consist of 6 digits")
    .refine((code) => {
      return code.match(/^[0-9]+$/) !== null;
    }, "The code must consist of 6 digits"),
});

export const eduEmailSchema = (domains: string[]) =>
  z.object({
    eduEmail: z
      .string()
      .email()
      .refine((email) => {
        return domains.some((domain) => email.endsWith(domain));
      }, "Email domain must correspond to the selected institution"),
  });
