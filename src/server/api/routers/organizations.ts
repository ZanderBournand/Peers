import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { v4 as uuidv4 } from "uuid";

import { OrganizationType } from "@prisma/client";

export const organizationRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().min(1).optional().nullable(),
        university: z.string().min(1),
        type: z.string().min(1),
        description: z.string().min(50),
        image: z.string().url().optional().nullable(),
        instagram: z.string().min(1).optional().nullable(),
        discord: z.string().min(1).optional().nullable(),
        facebook: z.string().min(1).optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.db.organization.update({
        where: { id: ctx.organization.id },
        data: {
          id: uuidv4(),
          name: input.name,
          email: input.email,
          university: input.university,
          type: input.type,
          description: input.description,
          image: input.image,
          instagram: input.instagram,
          discord: input.discord,
          facebook: input.facebook,
        },
      });
      
      return org;
    }),

    getCurrent: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const org = await ctx.db.organization.findUnique({
        where: { id: input.id },
      });

      if (!org) {
        throw new Error("Organization not found");
      }

      return org;
    }),
});