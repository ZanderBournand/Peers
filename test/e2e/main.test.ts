/*
  File -> Main file for all E2E tests (uses Playwright)
  - Includes basic setup & tests for all of Peers
*/

import { test, expect, type Page } from "@playwright/test";
import { type SupabaseClient, type Session } from "@supabase/supabase-js";
import {
  createTestSupabaseClient,
  toggleUserVerification,
  type TestUser,
} from "../utils";

import { config } from "dotenv";
config();

let testUser: TestUser;
let session: Session;
let supabase: SupabaseClient;

test.beforeAll(async () => {
  testUser = JSON.parse(process.env.TEST_USER ?? "{}") as TestUser;
  session = JSON.parse(process.env.SESSION ?? "{}") as Session;
  supabase = createTestSupabaseClient();
});

const addAuthCookies = async (page: Page) => {
  // Convert session object into string JSON string
  const cookieValue = JSON.stringify(session);

  // Add session cookie (allows app to authenticate user)
  await page.context().addCookies([
    {
      name: "sb-erwggivaefiaiqdqgtqb-auth-token",
      value: cookieValue,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: true,
    },
  ]);
};

test("No Auth - Home page - Redirect to login page", async ({ page }) => {
  await page.goto("/");

  await page.waitForURL("**/login");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("Auth - Home page", async ({ page }) => {
  await addAuthCookies(page);
  await page.goto("/");

  // TEMPORARY FIX: Need to add timeout -> Next.js causing first render to bug out
  await expect(page.getByText(`Hey, @${testUser.username}!`)).toBeVisible({
    timeout: 15000,
  });
});

test.describe("Auth - Create Event Button", () => {
  test.describe.configure({ mode: "serial" });

  test("Redirect to verification modal", async ({ page }) => {
    await addAuthCookies(page);
    await toggleUserVerification(supabase, testUser, false);
    await page.goto(`/user/${testUser.id}`);

    await page.click("#create-event-link");

    await expect(
      page.getByRole("heading", { name: "Student Verification Required" }),
    ).toBeVisible();
  });

  test("Successful navigation", async ({ page }) => {
    await addAuthCookies(page);
    await toggleUserVerification(supabase, testUser, true);
    await page.goto(`/user/${testUser.id}`);

    await page.click("#create-event-link");

    await page.waitForURL("**/event/new");
    await expect(
      page.getByRole("heading", { name: "Create an Event" }),
    ).toBeVisible();
  });
});
