import { userRouter } from "@/server/api/routers/users";
import { eventRouter } from "@/server/api/routers/events";
import { verifyStudentRouter } from "@/server/api/routers/verifyStudent";
import { universityRouter } from "./routers/university";
import { tagRouter } from "@/server/api/routers/tags";
import { createTRPCRouter } from "@/server/api/trpc";
import { organizationRouter } from "./routers/organizations";

export const appRouter = createTRPCRouter({
  users: userRouter,
  organizations: organizationRouter,
  events: eventRouter,
  verifyStudent: verifyStudentRouter,
  universities: universityRouter,
  tags: tagRouter,
});

export type AppRouter = typeof appRouter;
