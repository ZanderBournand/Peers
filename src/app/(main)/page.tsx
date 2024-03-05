import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { api } from "@/trpc/server";
import CreateEventButton from "@/components/events/CreateEventButton";
import EventPreview from "@/components/events/EventPreview";
import type { EventData } from "@/lib/interfaces/eventData";
import moment from "moment";
import { getDisplayName } from "@/lib/utils";

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

  return user && userData ? (
    <div className="flex items-center justify-center pb-32">
      <div className="mt-16 flex max-w-screen-2xl flex-col items-center justify-center">
        <span>Hey, {getDisplayName(userData, false)}!</span>
        <CreateEventButton userData={userData} />
        <div className="grid w-full grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEvent?.map((event) => (
            <EventPreview key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  ) : (
    <span className="bg-btn-background hover:bg-btn-background-hover ml-12 flex rounded-md px-3 py-2 no-underline">
      Welcome to Peers!
    </span>
  );
}
