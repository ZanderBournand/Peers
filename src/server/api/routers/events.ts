import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { TagSchema } from "../../../lib/validators/Tag";
import { EventType, TagCategory } from "@prisma/client";
import { sortUpcomingEvents } from "@/lib/utils";
import { type EventData } from "@/lib/interfaces/eventData";

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
  getAll: privateProcedure
    .input(z.object({ filter: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      let events: EventData[] = await ctx.db.event.findMany({
        include: {
          userHost: true,
          orgHost: true,
        },
      });

      if (input?.filter === "upcoming") {
        events = sortUpcomingEvents(events);
      }
      return events;
    }),
  get: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { id: input.id },
        include: {
          userHost: {
            include: {
              university: true,
            },
          },
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
  getRecommended: privateProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = input?.userId ?? ctx.user.id;

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        include: {
          attends: { include: { userHost: true, orgHost: true } },
          interests: true,
        },
      });

      const hostIds = user?.attends
        .map((event) => event.userHostId ?? event.orgHostId)
        .filter((id) => id !== null) as string[];

      const interestsIds = user?.interests.map((interest) => interest.id) ?? [];

      const queryOptions = {
        where: {},
        include: {
          userHost: true,
          orgHost: true,
        },
      };

      if (hostIds.length > 0 || interestsIds.length > 0) {
        queryOptions.where = {
          AND: [
            {
              OR: [
                { userHostId: { in: hostIds } },
                { orgHostId: { in: hostIds } },
                { tags: { some: { id: { in: interestsIds } } } },
              ],
            },
            {
              NOT: [{ userHostId: userId }],
            },
          ],
        };
      }

      const recommendedEvents: EventData[] =
        await ctx.db.event.findMany(queryOptions);

      const sortedEvents = sortUpcomingEvents(recommendedEvents);

      return sortedEvents;
    }),
  getUniversity: privateProcedure
    .input(z.object({ university: z.string() }))
    .query(async ({ ctx, input }) => {
      let events: EventData[] = await ctx.db.event.findMany({
        where: {
          OR: [
            {
              userHost: {
                universityName: input.university,
              },
            },
            {
              orgHost: {
                universityName: input.university,
              },
            },
          ],
        },
        include: {
          userHost: true,
          orgHost: true,
        },
      });

      events = sortUpcomingEvents(events);

      return events;
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
          attends: {
            include: {
              userHost: true,
              orgHost: true,
            },
          },
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
          hostEvents: {
            include: {
              userHost: true,
              orgHost: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user.hostEvents;
    }),
  getOrgEvents: privateProcedure
    .input(z.object({ orgId: z.string() }))
    .query(async ({ ctx, input }) => {
      const events = await ctx.db.event.findMany({
        where: { orgHostId: input.orgId },
        include: {
          orgHost: true,
          tags: true,
          attendees: true,
        },
      });

      if (!events) {
        throw new Error("No events found for this organization");
      }

      const sortedEvents = sortUpcomingEvents(events);

      return sortedEvents;
    }),
  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.event.delete({
        where: { id: input.id },
      });

      return event;
    }),
  getRecommendedHosts: privateProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = input?.userId ?? ctx.user.id;

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        include: {
          attends: true,
          interests: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const attendedEventIds = user.attends.map((event) => event.id);
      const interestIds = user.interests.map((interest) => interest.id);

      const organizations = await ctx.db.organization.findMany({
        where: {
          AND: [
            { hostEvents: { some: {} } },
            {
              OR: [
                { hostEvents: { some: { id: { in: attendedEventIds } } } },
                { universityName: user.universityName ?? "" },
                {
                  hostEvents: {
                    some: { tags: { some: { id: { in: interestIds } } } },
                  },
                },
              ],
            },
          ],
        },
        include: {
          university: true,
        },
      });

      const users = await ctx.db.user.findMany({
        where: {
          AND: [
            { hostEvents: { some: {} } },
            { id: { not: userId } },
            {
              OR: [
                { hostEvents: { some: { id: { in: attendedEventIds } } } },
                { universityName: user.universityName },
                {
                  hostEvents: {
                    some: { tags: { some: { id: { in: interestIds } } } },
                  },
                },
              ],
            },
          ],
        },
        include: {
          university: true,
          interests: true,
        },
      });

      return { users, organizations };
    }),
  getEventsByHosts: privateProcedure
    .input(z.object({ hostIds: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      const events: EventData[] = await ctx.db.event.findMany({
        where: {
          OR: [
            { userHostId: { in: input.hostIds } },
            { orgHostId: { in: input.hostIds } },
          ],
        },
        include: {
          userHost: true,
          orgHost: true,
        },
      });

      const sortedEvents = sortUpcomingEvents(events);

      return sortedEvents;
    }),
  getEventsByCategories: privateProcedure
    .input(z.object({ categories: z.array(z.nativeEnum(TagCategory)) }))
    .query(async ({ ctx, input }) => {
      const events: EventData[] = await ctx.db.event.findMany({
        where: {
          tags: {
            some: {
              category: {
                in: input.categories,
              },
            },
          },
        },
        include: {
          userHost: true,
          orgHost: true,
        },
      });

      const sortedEvents = sortUpcomingEvents(events);

      return sortedEvents;
    }),
    searchEvents: privateProcedure
    .input(
        z.object({
            searchTerm: z.string(),
        }),
    )
    .query(async ({ ctx, input }) => {
        const events = await ctx.db.event.findMany({
            where: {
                OR: [
                    { title: { contains: input.searchTerm } },
                    { description: { contains: input.searchTerm } },
                    { tags: { some: { name: { contains: input.searchTerm } } } },
                ],
            },
            include: {
                tags: true,
                userHost: true,
                orgHost: true,
            },
        });

        return events;
    }),
});
