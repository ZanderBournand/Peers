/*
  File -> Functions to create Supabase on the client side
  - Supabase is the service we use for our database hosting
*/

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/env";

export const createClient = () =>
  createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
