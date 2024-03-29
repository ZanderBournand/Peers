import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const universityRouter = createTRPCRouter({
  getAllUniversities: privateProcedure.query(async ({ ctx }) => {
    const allUniversities = await ctx.db.university.findMany();
    return allUniversities;
  }),
});
