import {
  createTestSupabaseClient,
  deleteTestAuthUser,
  deleteTestDBUser,
  type TestUser,
} from "../../utils";

import { config } from "dotenv";
config();

let testUser: TestUser;

export default async function globalTeardown() {
  testUser = JSON.parse(process.env.TEST_USER ?? "{}") as TestUser;

  const supabase = createTestSupabaseClient();

  // Delete User (in DB) entry
  testUser.id && (await deleteTestDBUser(supabase, testUser.id));

  // Delete Auth (via Supabase Auth) entry
  testUser.id && (await deleteTestAuthUser(supabase, testUser.id));
}
