/*
  File -> Main router for the application
  - Imports all routers and creates the main router
*/

import { userRouter } from "@/server/api/routers/users";
import { eventRouter } from "@/server/api/routers/events";
import { verifyStudentRouter } from "@/server/api/routers/verifyStudent";
import { universityRouter } from "./routers/university";
import { tagRouter } from "@/server/api/routers/tags";
import { createTRPCRouter } from "@/server/api/trpc";
import { organizationRouter } from "./routers/organizations";
import { dailyApiRouter } from "./routers/dailyapi";

export const appRouter = createTRPCRouter({
  users: userRouter,
  organizations: organizationRouter,
  events: eventRouter,
  verifyStudent: verifyStudentRouter,
  universities: universityRouter,
  tags: tagRouter,
  dailyapi: dailyApiRouter,
});

export type AppRouter = typeof appRouter;
