import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { api } from "@/trpc/server";
import CreateEventButton from "@/components/events/CreateEventButton";
import EventPreview from "@/components/events/EventPreview";
import type { EventData } from "@/lib/interfaces/eventData";
import moment from "moment";

export default async function AuthButton() {
  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userData = user && (await api.users.getCurrent.query());
  const events: EventData[] = await api.events.getAll.query();

  const filteredEvent = events.sort((a, b) => {
    const aEndDate = moment(a.date).add(a.duration, "minutes");
    const bEndDate = moment(b.date).add(b.duration, "minutes");
    const aIsCompleted = moment().isAfter(aEndDate);
    const bIsCompleted = moment().isAfter(bEndDate);

    if (aIsCompleted !== bIsCompleted) {
      return aIsCompleted ? 1 : -1;
    }

    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const displayName = userData?.firstName ?? userData?.username;

  return user && userData ? (
    <div className="mt-16 flex flex-col items-center justify-center">
      <span>Hey, {displayName}!</span>
      <CreateEventButton userData={userData} />
      <div className="grid w-11/12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredEvent?.map((event) => (
          <EventPreview key={event.id} event={event} />
        ))}
      </div>
    </div>
  ) : (
    <span className="bg-btn-background hover:bg-btn-background-hover ml-12 flex rounded-md px-3 py-2 no-underline">
      Welcome to Peers!
    </span>
  );
}
