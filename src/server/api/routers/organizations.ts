import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { v4 as uuidv4 } from "uuid";

export const organizationRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().min(1).optional(),
        type: z.string().min(1),
        description: z.string().min(50),
        image: z.string().url().optional(),
      }),
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
          id: uuidv4(),
          name: input.name,
          email: input.email,
          type: input.type,
          description: input.description,
          image: input.image,
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
