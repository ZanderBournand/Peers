import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "@/trpc/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isUserCreated =
      user?.email &&
      (await api.users.isUserCreated.query({ email: user.email }));

    if (!isUserCreated && user?.email) {
      let username, isUsernameTaken;
      do {
        username =
          "Peer" + Math.floor(Math.random() * 90000 + 10000).toString();
        isUsernameTaken = await api.users.isUsernameTaken.query({ username });
      } while (isUsernameTaken);

      await api.users.create.mutate({
        id: user.id,
        email: user.email,
        username: username,
      });
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}
