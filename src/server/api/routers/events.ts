import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

import { EventType } from "@prisma/client";

export const eventRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z
        .object({
          title: z.string(),
          location: z.string().optional(),
          date: z.date(),
          description: z.string(),
          image: z.string().optional(),
          type: z.nativeEnum(EventType),
          duration: z.number().int(),
          userHostId: z.string().optional(),
          orgHostId: z.string().optional(),
        })
        .refine(
          (data) => {
            // Either userHostId or orgHostId should be provided, but not both
            return (
              (data.userHostId == undefined) !== (data.orgHostId == undefined)
            );
          },
          {
            message:
              "Either userHostId or orgHostId should be provided, but not both",
            path: ["userHostId", "orgHostId"],
          },
        ),
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
          userHostId: input.userHostId,
          orgHostId: input.orgHostId,
        },
      });

      return event;
    }),
  getAll: privateProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.event.findMany({
      include: {
        userHost: true,
        orgHost: true,
      },
    });
    return events;
  }),
});
