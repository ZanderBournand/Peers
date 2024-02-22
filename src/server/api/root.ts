import { userRouter } from "@/server/api/routers/users";
import { eventRouter } from "@/server/api/routers/events";
import { mailgunRouter } from "@/server/api/routers/mailgun";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  users: userRouter,
  events: eventRouter,
  mailgun: mailgunRouter,
});

export type AppRouter = typeof appRouter;
