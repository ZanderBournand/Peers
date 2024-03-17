import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

import { OrganizationType } from "@prisma/client";

export const orgRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z
        .object({
          name: z.string().min(1),
          email: z.string().min(1).optional(),
          type: z.nativeEnum(OrganizationType),
          description: z.string().min(50),
          image: z.string().url().optional(),
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
      const event = await ctx.db.event.create({
        data: {
          name: z.string().min(1),
          email: z.string().min(1).optional(),
          type: z.nativeEnum(OrganizationType),
          description: z.string().min(50),
          image: z.string().url().optional(),
        },
      });

      return event;
    }),
});
