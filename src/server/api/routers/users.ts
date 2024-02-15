import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  createOrUpdate: privateProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
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
          username: "", // TODO: See why ctx.user.username is undefined
          firstName: input.firstName,
          lastName: input.lastName,
          skills: input.skills,
          bio: input.bio,
          github: input.github,
          linkedin: input.linkedin,
          website: input.website,
        },
        update: {
          firstName: input.firstName,
          lastName: input.lastName,
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
  isUserCreated: privateProcedure
  .input(z.object({ email: z.string().email() }))
  .query(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: { email: input.email },
    });
    return Boolean(user);
  }),
});