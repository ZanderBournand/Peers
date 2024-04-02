import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

import { OrganizationType } from "@prisma/client";

export const organizationRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z
        .object({
          name: z.string().min(1),
          email: z.string().min(1).optional().nullable(),
          university: z.string().min(1).optional().nullable(),
          type: z.nativeEnum(OrganizationType),
          description: z.string().min(50),
          image: z.string().url().optional().nullable(),
          instagram: z.string().min(1).optional().nullable(),
          discord: z.string().min(1).optional().nullable(),
          facebook: z.string().min(1).optional().nullable(),
        })
        //not sure i need the following code:
        // .refine(
        //   (data) => {
        //     // Either userHostId or orgHostId should be provided, but not both
        //     return (
        //       (data.userHostId == undefined) !== (data.orgHostId == undefined)
        //     );
        //   },
        //   {
        //     message:
        //       "Either userHostId or orgHostId should be provided, but not both",
        //     path: ["userHostId", "orgHostId"],
        //   },
        // ),
    )
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.db.organization.create({
        data: {
          name: z.string().min(1),
          email: z.string().min(1).optional(),
          university: z.string().min(1).optional(),
          type: z.nativeEnum(OrganizationType),
          description: z.string().min(50),
          image: z.string().url().optional(),
          instagram: z.string().min(1).optional(),
          discord: z.string().min(1).optional(),
          facebook: z.string().min(1).optional(),
        },
      });

      return org;
    }),
});
