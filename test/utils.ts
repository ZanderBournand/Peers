import { type SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

import { config } from "dotenv";
config();

export interface TestUser {
  id?: string;
  email: string;
  image: string;
  password: string;
  username: string;
}

export const baseTestUser: TestUser = {
  email: "test_user@peers.test",
  image: "https://picsum.photos/200",
  password: "123456",
  username: "TEST_USER",
};

export const createTestSupabaseClient = () => {
  return createClient(
    process.env.TESTING_SUPABASE_URL ?? "",
    process.env.TESTING_SUPABASE_SERVICE_ROLE_KEY ?? "",
  );
};

export const createTestAuthUser = async (supabase: SupabaseClient) => {
  const testUser = await supabase.auth.admin.createUser({
    email: baseTestUser.email,
    password: baseTestUser.password,
    email_confirm: true,
  });

  return testUser.data.user;
};

export const createTestDBUser = async (
  supabase: SupabaseClient,
  user: TestUser,
) => {
  const newDBUser = await supabase.from("User").upsert({
    id: user.id,
    email: user?.email,
    image: user?.image,
    username: user?.username,
    isVerifiedStudent: false,
  });

  return newDBUser;
};

export const getTestUserSession = async (
  supabase: SupabaseClient,
  user: TestUser,
) => {
  const session = await supabase.auth.signInWithPassword({
    email: user.email,
    password: user.password,
  });

  return session.data.session;
};

export const deleteTestAuthUser = async (
  supabase: SupabaseClient,
  userId: string,
) => {
  await supabase?.auth.admin.deleteUser(userId);
};

export const deleteTestDBUser = async (
  supabase: SupabaseClient,
  userId: string,
) => {
  await supabase?.from("User").delete().eq("id", userId);
};

export const toggleUserVerification = async (
  supabase: SupabaseClient,
  user: TestUser,
  shouldVerify: boolean,
) => {
  const { error } = await supabase
    ?.from("User")
    .update({
      isVerifiedStudent: shouldVerify,
    })
    .eq("id", user?.id)
    .select();

  if (error) {
    console.error("Error setting user verification status:", error);
  }
};
