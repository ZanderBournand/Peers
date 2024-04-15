import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { TagSchema } from "@/lib/validators/Tag";

export const userRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email(),
        username: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.create({
        data: {
          id: input.id,
          email: input.email,
          username: input.username,
          isVerifiedStudent: false,
          points: 0,
          image:
            "https://erwggivaefiaiqdqgtqb.supabase.co/storage/v1/object/public/images/users/base_profile_pic.jpg",
        },
      });
      return user;
    }),
  update: privateProcedure
    .input(
      z.object({
        image: z.string().url(),
        firstName: z.string(),
        lastName: z.string(),
        interests: TagSchema.array(),
        bio: z.string(),
        github: z.string(),
        linkedin: z.string(),
        website: z.union([z.literal(""), z.string().trim().url()]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.user.id },
        data: {
          image: input.image,
          firstName: input.firstName,
          lastName: input.lastName,
          interests: {
            set: input.interests?.map((tag) => ({ id: tag.id })),
          },
          bio: input.bio,
          github: input.github,
          linkedin: input.linkedin,
          website: input.website,
        },
      });
      return user;
    }),
  getUser: privateProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = input?.id ?? ctx.user.id;

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        include: {
          university: true,
          interests: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

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
  isUsernameTaken: privateProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { username: input.username },
      });
      return Boolean(user);
    }),
  getAllUsers: privateProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      include: {
        university: true,
      },
    });
    return users;
  }),
  searchUsers: privateProcedure
    .input(z.object({ searchTerm: z.string() }))
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        where: {
          OR: [
            { firstName: { contains: input.searchTerm } },
            { lastName: { contains: input.searchTerm } },
            { username: { contains: input.searchTerm } },
          ],
        },
        include: {
          university: true,
        },
      });
      return users;
    }),
});
