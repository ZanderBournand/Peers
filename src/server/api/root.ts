import { userRouter } from "@/server/api/routers/users";
import { organizationRouter } from "@/server/api/routers/organizations";
import { eventRouter } from "@/server/api/routers/events";
import { verifyStudentRouter } from "@/server/api/routers/verifyStudent";
import { tagRouter } from "@/server/api/routers/tags";

import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  users: userRouter,
  organizations: organizationRouter,
  events: eventRouter,
  verifyStudent: verifyStudentRouter,
  tags: tagRouter,
});

export type AppRouter = typeof appRouter;
