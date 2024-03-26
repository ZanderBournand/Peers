import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { v4 as uuidv4 } from "uuid";

import { OrganizationType } from "@prisma/client";

export const organizationRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z
        .object({
          name: z.string().min(1),
          email: z.string().min(1).optional(),
          type: z.nativeEnum(OrganizationType),
          description: z.string().min(50),
          image: z.string().url().optional(),
          instagram: z.string().min(1).optional(),
          discord: z.string().min(1).optional(),
          facebook: z.string().min(1).optional(),
        })
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

      const event = await ctx.db.organization.create({
        data: {
          name: z.string().min(1),
          email: z.string().min(1).optional(),
          type: z.nativeEnum(OrganizationType),
          description: z.string().min(50),
          image: z.string().url().optional(),
          instagram: z.string().min(1).optional(),
          discord: z.string().min(1).optional(),
          facebook: z.string().min(1).optional(),
          admins: {
            connect: {
              id: ctx.user.id,
            },
          },
        },
      });

      return event;
    }),
  getAdminOrganizations: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const organizations = await ctx.db.organization.findMany({
        where: {
          admins: {
            some: {
              id: input.userId,
            },
          },
        },
      });

      return organizations;
    }),
});
