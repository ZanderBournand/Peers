/*
  File -> Layout (base template) for all pages within "authentication" (sign-in, sign-up, etc.)
  - Redirects users to "home page" if already logged-in
*/

import React from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const RootLayout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }
  return <div className="relative mx-auto max-w-screen-2xl">{children}</div>;
};

export default RootLayout;
