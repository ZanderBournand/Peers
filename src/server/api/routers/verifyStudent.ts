import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import formData from 'form-data';
import Mailgun from 'mailgun.js';

export const verifyStudentRouter = createTRPCRouter({
  sendEmail: privateProcedure
    .input(
      z.object({
        to: z.string().email(),
        subject: z.string(),
        text: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY || '',
      });

      try {
        const message = await mg.messages.create(process.env.MAILGUN_DOMAIN || '', {
          from: 'Peers <mailgun@yourdomain.com>',
          to: input.to,
          subject: input.subject,
          text: input.text,
        });

        return { success: true, message: "Email sent successfully", messageId: message.id };
      } catch (error) {
        console.error(error);
        throw new Error('Failed to send email');
      }
    }),
    insertVerificationCode: privateProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const verificationCode = await ctx.db.verification_Code.create({
        data: {
          id: ctx.user.id,
          code: input.code,
        },
      });
      return verificationCode;
    }),
    deleteVerificationCode: privateProcedure
    .mutation(async ({ ctx }) => {
      const verificationCode = await ctx.db.verification_Code.delete({
        where: { id: ctx.user.id },
      });
      return verificationCode;
    }),
    isVerificationCodeCorrect: privateProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const verificationCode = await ctx.db.verification_Code.findFirst({
        where: { id: ctx.user.id },
      });

      if (verificationCode?.code === input.code) {
        const user = await ctx.db.user.update({
          where: { id: ctx.user.id },
          data: { isVerifiedStudent: true },
        });
        return true;
      }

      return false;
    }),
});