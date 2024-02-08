import { userRouter } from "@/server/api/routers/users";
import { eventRouter } from "@/server/api/routers/events";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  users: userRouter,
  events: eventRouter,
});

export type AppRouter = typeof appRouter;
