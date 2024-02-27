import React from "react";
import Navbar from "@/components/navbar/Navbar";
import AuthComponent from "@/components/navbar/AuthComponent";
import { VerificationProvider } from "@/lib/context/VerificationContext";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const RootLayout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Navbar>
        <AuthComponent />
      </Navbar>
      <VerificationProvider>
        {children}
      </VerificationProvider>
    </>
  );
};

export default RootLayout;
