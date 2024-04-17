import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { v4 as uuidv4 } from "uuid";
import { OrganizationType } from "@prisma/client";

export const organizationRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        name: z.string().min(1),
        university: z.string().min(1),
        type: z.nativeEnum(OrganizationType),
        description: z.string().min(50),
        image: z.string().url(),
        email: z.string().min(1),
        instagram: z.string().url().optional().nullable(),
        discord: z.string().url().optional().nullable(),
        facebook: z.string().url().optional().nullable(),
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

      const org = await ctx.db.organization.create({
        data: {
          id: uuidv4(),
          name: input.name,
          type: input.type,
          description: input.description,
          image: input.image,
          email: input.email,
          instagram: input.instagram,
          facebook: input.facebook,
          discord: input.discord,
          university: {
            connect: {
              name: input.university,
            },
          },
          admins: {
            connect: {
              id: ctx.user.id,
            },
          },
        },
      });
      return org;
    }),
  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        type: z.nativeEnum(OrganizationType),
        description: z.string(),
        image: z.string(),
        instagram: z.string().url().optional().nullable(),
        discord: z.string().url().optional().nullable(),
        facebook: z.string().url().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.db.organization.update({
        where: { id: input.id },
        data: {
          name: input.name,
          type: input.type,
          description: input.description,
          image: input.image,
          email: input.email,
          instagram: input.instagram,
          facebook: input.facebook,
          discord: input.discord,
        },
      });
      return org;
    }),
  getOrganization: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const org = await ctx.db.organization.findUnique({
        where: { id: input.id },
        include: {
          university: true,
          admins: {
            include: {
              university: true,
            },
          },
        },
      });

      if (!org) {
        throw new Error("Organization not found");
      }

      return org;
    }),
  addAdmin: privateProcedure
    .input(
      z.object({
        orgId: z.string(),
        adminEmail: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const requestingUser = await ctx.db.user.findUnique({
        where: { id: ctx.user.id },
        include: { adminOf: true },
      });
      if (
        !requestingUser ||
        !requestingUser.adminOf.some((org) => org.id === input.orgId)
      ) {
        throw new Error("Only admins can add admins");
      }

      const admin = await ctx.db.user.findUnique({
        where: { email: input.adminEmail },
      });
      if (!admin) {
        throw new Error("Admin not found");
      }

      const org = await ctx.db.organization.update({
        where: { id: input.orgId },
        data: {
          admins: {
            connect: {
              id: admin.id,
            },
          },
        },
      });
      return org;
    }),

  removeAdmin: privateProcedure
    .input(
      z.object({
        orgId: z.string(),
        adminEmail: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const requestingUser = await ctx.db.user.findUnique({
        where: { id: ctx.user.id },
        include: { adminOf: true },
      });
      if (
        !requestingUser ||
        !requestingUser.adminOf.some((org) => org.id === input.orgId)
      ) {
        throw new Error("Only admins can remove admins");
      }

      const admin = await ctx.db.user.findUnique({
        where: { email: input.adminEmail },
      });
      if (!admin) {
        throw new Error("Admin not found");
      }

      const org = await ctx.db.organization.update({
        where: { id: input.orgId },
        data: {
          admins: {
            disconnect: {
              id: admin.id,
            },
          },
        },
      });
      return org;
    }),
  getAdminOrgs: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        include: {
          adminOf: {
            include: {
              university: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user.adminOf;
    }),
  searchOrganizations: privateProcedure
    .input(
      z.object({
        searchInput: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const searchWords = input.searchInput.split(" ");

      const organizations = await ctx.db.organization.findMany({
        where: {
          OR: searchWords.map((word) => ({
            OR: [
              { name: { contains: word, mode: "insensitive" } },
              {
                description: {
                  contains: word,
                  mode: "insensitive",
                },
              },
            ],
          })),
        },
        include: {
          university: true,
        },
      });

      return organizations;
    }),
});
