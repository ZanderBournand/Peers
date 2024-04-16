import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const SearchRouter = createTRPCRouter({
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
        },
      });

      return events;
    }),
  searchOrganizations: privateProcedure
    .input(
      z.object({
        searchTerm: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const organizations = await ctx.db.organization.findMany({
        where: {
          OR: [{ name: { contains: input.searchTerm } }],
        },
      });

      return organizations;
    }),
});
export default SearchRouter;
