/*
  File -> Helper file for setting up the E2E tests
  - Sets up the database connection, test users, etc...
*/

import {
  baseTestUser,
  createTestAuthUser,
  createTestDBUser,
  createTestSupabaseClient,
  getTestUserSession,
} from "../../utils";

import { config } from "dotenv";
config();

const testUser = baseTestUser;

export default async function globalSetup() {
  const supabase = createTestSupabaseClient();

  // Create Auth (via Supabase Auth) entry
  await createTestAuthUser(supabase).then((res) => (testUser.id = res?.id));

  // Create User (in DB) entry
  await createTestDBUser(supabase, testUser);

  // Sign in user to get session
  const session = await getTestUserSession(supabase, testUser);

  process.env.TEST_USER = JSON.stringify(testUser);
  process.env.SESSION = JSON.stringify(session);
}
