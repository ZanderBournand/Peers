import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { api } from "@/trpc/server";
import Link from "next/link";

export default async function AuthButton() {
  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  var userData = null;
  if (user) {
    userData = await api.users.getCurrent.query();
  }

  return user ? (
    <div className="mt-16 flex flex-col items-center justify-center">
      <span>Hey, {userData?.firstName}!</span>
      <Link href="/event/new">
        <Button className="my-8" variant="outline">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </Link>
    </div>
  ) : (
    <span className="bg-btn-background hover:bg-btn-background-hover ml-12 flex rounded-md px-3 py-2 no-underline">
      Welcome to Peers!
    </span>
  );
}
