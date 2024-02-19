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

  const userData = user && await api.users.getCurrent.query();

  const displayName = userData?.firstName || userData?.username;
  
  return user ? (
    <div className="mt-16 flex flex-col items-center justify-center">
      <span>Hey, {displayName}!</span>
      { !userData?.isVerifiedStudent &&
        <Link href="/event/new">
          <Button className="my-8" variant="outline">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      }
      { userData?.isVerifiedStudent &&
        <div className="mt-6 flex flex-col items-center">
        <span className="mb-2">To create events, verify your student status.</span>
        <Link href="/verify-student">
          <Button className="mt-1" variant="outline">
            Verify Student Status
          </Button>
        </Link>
      </div>
      }
    </div>
  ) : (
    <span className="bg-btn-background hover:bg-btn-background-hover ml-12 flex rounded-md px-3 py-2 no-underline">
      Welcome to Peers!
    </span>
  );
}
