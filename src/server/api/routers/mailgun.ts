import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { env } from "@/env"; // Adjust this import based on your project structure

export const mailgunRouter = createTRPCRouter({
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
});