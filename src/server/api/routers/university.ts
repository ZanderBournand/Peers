import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/env";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const universityRouter = createTRPCRouter({
  getAllUniversities: privateProcedure.query(async ({ ctx }) => {
    const allUniversities = await ctx.db.university.findMany();
    return allUniversities;
  }),
  getUniversity: privateProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const university = await ctx.db.university.findUnique({
        where: { name: input.name },
      });
      return university;
    }),
  setUniversityLogo: privateProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.user.id },
    });

    if (!user?.university) {
      return null;
    }

    const university = await ctx.db.university.findUnique({
      where: { name: user?.university },
    });

    if (!university?.logo || university?.is_logo_uploaded) {
      return null;
    }

    const supabase = createClient(cookies());
    const response = await fetch(university.logo);
    const blob = await response.blob();
    const file = new File([blob], uuidv4(), { type: "image/png" });

    const { data: imageData, error } = await supabase.storage
      .from("images")
      .upload(`universities/${file.name}`, file);

    if (error) {
      console.error("Error uploading new logo", error);
      throw new Error("Error uploading new logo");
    }

    const url = `${env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${imageData?.path}`;
    console.log("URL: " + url);

    const updatedUni = await ctx.db.university.update({
      where: { name: user.university },
      data: { logo: url, is_logo_uploaded: true },
    });

    return updatedUni;
  }),
});
