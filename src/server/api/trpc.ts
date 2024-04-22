/*
  File -> Setup for TRPC backend API
  - Constructs the context for our TRPC object (used in the API)
*/

import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import { db } from "@/server/db";
import { mg } from "@/server/mg";

import { type User } from "@supabase/supabase-js";

type CreateContextOptions = {
  user: User | null;
  headers: Headers | null;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    ...opts,
    db,
    mg,
  };
};

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return createInnerTRPCContext({
    user,
    ...opts,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const privateProcedure = t.procedure.use(enforceUserIsAuthed);
