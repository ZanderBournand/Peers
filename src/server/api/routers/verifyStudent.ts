/*
  File -> Backend API functions for dealing with student verification
  - Uses TRPC for API definition
  - Interacts with database via Prisma (& Supabase)
*/

import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const verifyStudentRouter = createTRPCRouter({
  sendVerificationCode: privateProcedure
    .input(
      z.object({
        to: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const verificationCode = String(
        Math.floor(Math.random() * 1000000),
      ).padStart(6, "0");

      await ctx.db.verification_Code.upsert({
        where: { userId: ctx.user.id },
        update: {
          code: verificationCode,
          createdAt: new Date(),
        },
        create: {
          userId: ctx.user.id,
          code: verificationCode,
          createdAt: new Date(),
        },
      });

      try {
        const message = await ctx.mg.messages.create(
          process.env.MAILGUN_DOMAIN ?? "",
          {
            from: "Peers <mailgun@yourdomain.com>",
            to: input.to,
            subject: "Student Verification Code",
            text:
              "Please enter the following code to verify your student email: " +
              verificationCode,
          },
        );

        return {
          success: true,
          message: "Email sent successfully",
          messageId: message.id,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to send email");
      }
    }),
  isVerificationCodeCorrect: privateProcedure
    .input(
      z.object({
        code: z.string(),
        university: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const verificationCode = await ctx.db.verification_Code.findFirst({
        where: { userId: ctx.user.id },
      });

      if (
        verificationCode?.code === input.code &&
        verificationCode.createdAt.getTime() + 1000 * 60 * 5 > Date.now()
      ) {
        await ctx.db.user.update({
          where: { id: ctx.user.id },
          data: {
            isVerifiedStudent: true,
            university: {
              connect: {
                name: input.university,
              },
            },
          },
        });

        await ctx.db.verification_Code.delete({
          where: { userId: ctx.user.id },
        });

        return true;
      }

      return false;
    }),
});
