import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

import { EventType } from "@prisma/client";

export const eventRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        title: z.string(),
        location: z.string().optional(),
        date: z.date(),
        description: z.string(),
        image: z.string().optional(),
        type: z.nativeEnum(EventType),
        duration: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.event.create({
        data: {
          title: input.title,
          location: input.location,
          date: input.date,
          description: input.description,
          image: input.image,
          type: input.type,
          duration: input.duration,
        },
      });

      return event;
    }),
});
