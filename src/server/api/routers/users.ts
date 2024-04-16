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
          prevThresh: 0,
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
  updatePoints: privateProcedure
    .input(
      z.object({
        userName: z.string(), // concatenated "firstName lastName"
        pointsToAdd: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userName, pointsToAdd } = input;

      // split userName and find
      const [firstName, lastName] = userName.split(" ");
      const user = await ctx.db.user.findFirst({
        where: { firstName, lastName },
      });

      if (!user) {
        throw new Error(`User '${userName}' not found`);
      }

      // updating user points
      const updatedUser = await ctx.db.user.update({
        where: { id: user.id },
        data: {
          points: {
            increment: pointsToAdd,
          },
        },
      });

      return updatedUser;
    }),
  getPoints: privateProcedure
    .input(z.object({ userName: z.string() })) // expects userName input
    .query(async ({ ctx, input }) => {
      const { userName } = input;

      // split userName into firstName and lastName
      const [firstName, lastName] = userName.split(" ");

      // finding user based on firstName and lastName
      const user = await ctx.db.user.findFirst({
        where: { firstName, lastName },
      });

      if (!user) {
        throw new Error(`User '${userName}' not found`);
      }

      return { points: user.points };
    }),
  getPrevThresh: privateProcedure
    .input(z.object({ userName: z.string() })) // expects userName input
    .query(async ({ ctx, input }) => {
      const { userName } = input;

      // split userName into firstName and lastName
      const [firstName, lastName] = userName.split(" ");

      // finding user based on firstName and lastName
      const user = await ctx.db.user.findFirst({
        where: { firstName, lastName },
      });

      if (!user) {
        throw new Error(`User '${userName}' not found`);
      }

      return { prevThresh: user.prevThresh };
    }),
  updatePrevThresh: privateProcedure
    .input(z.object({ userName: z.string(), prevThresh: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { userName, prevThresh } = input;

      // Split userName into firstName and lastName
      const [firstName, lastName] = userName.split(" ");

      // Find the user based on firstName and lastName
      const user = await ctx.db.user.findFirst({
        where: { firstName, lastName },
      });

      if (!user) {
        throw new Error(`User '${userName}' not found`);
      }

      // Update the user's prevThresh value
      const updatedUser = await ctx.db.user.update({
        where: { id: user.id },
        data: { prevThresh },
      });

      return updatedUser;
    }),
  searchUsers: privateProcedure
    .input(z.object({ searchInput: z.string() }))
    .query(async ({ ctx, input }) => {
      const searchWords = input.searchInput.split(" ");

      const users = await ctx.db.user.findMany({
        where: {
          OR: searchWords.map((word) => ({
            OR: [
              { firstName: { contains: word, mode: "insensitive" } },
              { lastName: { contains: word, mode: "insensitive" } },
              { username: { contains: word, mode: "insensitive" } },
              { bio: { contains: word, mode: "insensitive" } },
            ],
          })),
        },
        include: {
          university: true,
          interests: true,
        },
      });
      return users;
    }),
});
