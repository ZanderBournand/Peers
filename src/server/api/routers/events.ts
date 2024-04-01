import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { TagSchema } from "../../../lib/validators/Tag";

import { EventType } from "@prisma/client";

export const eventRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z
        .object({
          title: z.string(),
          location: z.string().optional().nullable(),
          locationDetails: z.string().optional().nullable(),
          date: z.date(),
          description: z.string(),
          image: z.string(),
          type: z.nativeEnum(EventType),
          duration: z.number().int(),
          tags: TagSchema.array().optional().nullable(),
          userHostId: z.string().optional().nullable(),
          orgHostId: z.string().optional().nullable(),
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
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.user.id },
      });

      if (!user?.isVerifiedStudent) {
        throw new Error(
          "User is not a verified student. Only verified users can create events.",
        );
      }

      const event = await ctx.db.event.create({
        data: {
          title: input.title,
          location: input.location,
          locationDetails: input.locationDetails,
          date: input.date,
          description: input.description,
          image: input.image,
          type: input.type,
          duration: input.duration,
          userHostId: input.userHostId,
          orgHostId: input.orgHostId,
          tags: {
            connect: input.tags?.map((tag) => ({ id: tag.id })),
          },
        },
      });

      return event;
    }),
    search: privateProcedure
      .input(
        z.object({
        searchTerm: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        const events = await ctx.db.event.findMany({
        where: {
          OR: [
          { orgHostId: { contains: input.searchTerm } },
          { title: { contains: input.searchTerm } },
          ],
        },
        });

        return events;
      }),
    search: privateProcedure
      .input(
        z.object({
        searchTerm: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        const events = await ctx.db.event.findMany({
        where: {
          OR: [
          { orgHostId: { contains: input.searchTerm } },
          { title: { contains: input.searchTerm } },
          ],
        },
        });

        return events;
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
  get: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { id: input.id },
        include: {
          userHost: true,
          orgHost: true,
          tags: true,
          attendees: true,
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      return event;
    }),
  toggleAttendance: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
        userId: z.string(),
        attending: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { id: input.eventId },
        include: { attendees: true },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      const isAttending = event.attendees.some(
        (user) => user.id === input.userId,
      );

      if (input.attending && !isAttending) {
        // Mark user as attending
        await ctx.db.event.update({
          where: { id: input.eventId },
          data: {
            attendees: {
              connect: { id: input.userId },
            },
          },
        });
      } else if (!input.attending && isAttending) {
        // Mark user as not attending
        await ctx.db.event.update({
          where: { id: input.eventId },
          data: {
            attendees: {
              disconnect: { id: input.userId },
            },
          },
        });
      }

      return { success: true };
    }),
  getEventsAttending: privateProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = input?.id ?? ctx.user.id;

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        include: {
          attends: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user.attends;
    }),
  getEventsHosting: privateProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = input?.id ?? ctx.user.id;

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        include: {
          hostEvents: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user.hostEvents;
    }),
  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.event.delete({
        where: { id: input.id },
      });

      return event;
    }),
});
