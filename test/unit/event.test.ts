/*
  File -> Main file for all unit tests (uses Vitest)
  - Includes basic setup, teardown & tests for all of Peers
*/

import { afterAll, beforeAll, expect, test } from "vitest";

import { appRouter } from "@/server/api/root";
import { createInnerTRPCContext, createCallerFactory } from "@/server/api/trpc";
import { type SupabaseClient, type User } from "@supabase/supabase-js";
import {
  createTestAuthUser,
  createTestDBUser,
  createTestSupabaseClient,
  deleteTestAuthUser,
  toggleUserVerification,
  baseTestUser,
  deleteTestDBUser,
} from "test/utils";
import { type RouterInputs } from "@/trpc/shared";

let supabase: SupabaseClient;
let testAuthUser: User | null;

const testUser = baseTestUser;

beforeAll(async () => {
  supabase = createTestSupabaseClient();

  testAuthUser = await createTestAuthUser(supabase);
  testUser.id = testAuthUser?.id;

  testUser && (await createTestDBUser(supabase, testUser));
});

afterAll(async () => {
  // Delete User (in DB) entry
  testAuthUser?.id && (await deleteTestDBUser(supabase, testAuthUser.id));

  // Delete Auth (via Supabase Auth) entry
  testAuthUser?.id && (await deleteTestAuthUser(supabase, testAuthUser.id));
});

const getTestTRPCCaller = () => {
  const ctx = createInnerTRPCContext({ user: testAuthUser, headers: null });
  const createCaller = createCallerFactory(appRouter);
  return createCaller(ctx);
};

test("Event Creation - Error Not Verified", async () => {
  const caller = getTestTRPCCaller();
  testUser && (await toggleUserVerification(supabase, testUser, false));

  const input: RouterInputs["events"]["create"] = {
    title: "Test event",
    date: new Date(),
    description: "Test description",
    image: "https://picsum.photos/200",
    type: "ONLINE_VIDEO",
    duration: 60,
    userHostId: testUser?.id,
  };

  await expect(caller.events.create(input)).rejects.toThrowError();
});

test("Event Creation - Successful", async () => {
  const caller = getTestTRPCCaller();
  testUser && (await toggleUserVerification(supabase, testUser, true));

  const input: RouterInputs["events"]["create"] = {
    title: "Test event",
    date: new Date(),
    description: "Test description",
    image: "https://picsum.photos/200",
    type: "ONLINE_VIDEO",
    duration: 60,
    userHostId: testUser?.id,
  };

  const event = await caller.events.create(input);
  const byId = await caller.events.get({ id: event.id });

  expect(byId).toMatchObject(input);

  // Delete the event after creation
  await caller.events.delete({ id: event.id });
});
