import { userRouter } from "@/server/api/routers/users";
import { eventRouter } from "@/server/api/routers/events";
import { verifyStudentRouter } from "@/server/api/routers/verifyStudent";
import { tagRouter } from "@/server/api/routers/tags";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  users: userRouter,
  events: eventRouter,
  verifyStudent: verifyStudentRouter,
  tags: tagRouter,
});

export type AppRouter = typeof appRouter;
