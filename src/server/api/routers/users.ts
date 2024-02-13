import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

import { RoleType } from "@prisma/client";

export const userRouter = createTRPCRouter({
  createOrUpdate: privateProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        role: z.nativeEnum(RoleType),
        skills: z.array(z.string()),
        bio: z.string(),
        github: z.string(),
        linkedin: z.string(),
        website: z.union([z.literal(""), z.string().trim().url()]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.upsert({
        where: { id: ctx.user.id },
        create: {
          id: ctx.user.id,
          email: ctx.user.email!,
          firstName: input.firstName,
          lastName: input.lastName,
          role: input.role,
          skills: input.skills,
          bio: input.bio,
          github: input.github,
          linkedin: input.linkedin,
          website: input.website,
        },
        update: {
          firstName: input.firstName,
          lastName: input.lastName,
          role: input.role,
          skills: input.skills,
          bio: input.bio,
          github: input.github,
          linkedin: input.linkedin,
          website: input.website,
        },
      });

      return user;
    }),
  getCurrent: privateProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.user.id },
    });
    return user;
  }),
  // doesEmailExist: procedure
});