import { userRouter } from "@/server/api/routers/users";
import { eventRouter } from "@/server/api/routers/events";
import { organizationRouter } from "@/server/api/routers/organizations";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  users: userRouter,
  events: eventRouter,
  organizations: organizationRouter,
});

export type AppRouter = typeof appRouter;
