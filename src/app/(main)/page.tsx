import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { api } from "@/trpc/server";
import EventButton from "@/components/buttons/createEventButton";
import EventPreview from "@/components/events/EventPreview";
import { type EventSchema } from "@/lib/validators/Events";
import { type z } from "zod";

export type EventType = z.infer<typeof EventSchema>;

export default async function AuthButton() {
  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userData = user && (await api.users.getCurrent.query());
  const events = await api.events.getAll.query();

  const displayName = userData?.firstName ?? userData?.username;

  return user && userData ? (
    <div className="mt-16 flex flex-col items-center justify-center">
      <span>Hey, {displayName}!</span>
      <EventButton userData={userData} />
      <div className="grid w-11/12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events?.map((event) => <EventPreview key={event.id} event={event} />)}
      </div>
    </div>
  ) : (
    <span className="bg-btn-background hover:bg-btn-background-hover ml-12 flex rounded-md px-3 py-2 no-underline">
      Welcome to Peers!
    </span>
  );
}
