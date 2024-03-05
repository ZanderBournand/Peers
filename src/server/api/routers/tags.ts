import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const tagRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const allTags = await ctx.db.tag.findMany();
    return allTags;
  }),
});
