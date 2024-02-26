import { z } from "zod";

export const verifyCode = z.object({
  verifyCode: z.string().length(6, "The code must consist of 6 digits").refine((code) => {
    return code.match(/^[0-9]+$/) !== null;
  }, "The code must consist of 6 digits")
});