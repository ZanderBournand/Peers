import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { api } from "@/trpc/server";
import CreateEventButton from "@/components/events/CreateEventButton";
import EventPreview from "@/components/events/EventPreview";
import type { EventData } from "@/lib/interfaces/eventData";
import moment from "moment";
import { getDisplayName } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default async function AuthButton() {
  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userData = user && (await api.users.getCurrent.query());
  const events: EventData[] = await api.events.getAll.query();

  const upcomingEvents = events
    .filter((event) => {
      const endDate = moment(event.date).add(event.duration, "minutes");
      return moment().isBefore(endDate);
    })
    .sort((a, b) => moment(a.date).diff(moment(b.date)));

  const completedEvents = events
    .filter((event) => {
      const endDate = moment(event.date).add(event.duration, "minutes");
      return moment().isAfter(endDate);
    })
    .sort((a, b) => moment(b.date).diff(moment(a.date)));

  return user && userData ? (
    <div className="flex items-center justify-center pb-32">
      <div className="mt-16 flex max-w-screen-2xl flex-col">
        <div className="flex flex-col items-center">
          <span className="text-lg">
            Hey, {getDisplayName(userData, false)}!
          </span>
          <CreateEventButton userData={userData} />
        </div>
        <div className="flex flex-col">
          <p className="mb-6 ml-4 text-2xl font-bold">Upcoming Events</p>
          <div className="grid w-full grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {upcomingEvents?.map((event) => (
              <EventPreview key={event.id} event={event} />
            ))}
          </div>
        </div>
        <Separator className="my-8 mb-16 w-3/4 self-center" />
        <div className="flex flex-col">
          <div className="mb-6 ml-4 flex flex-row items-center text-2xl font-bold">
            Past Events
          </div>
          <div className="grid w-full grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {completedEvents?.map((event) => (
              <EventPreview key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <span className="bg-btn-background hover:bg-btn-background-hover ml-12 flex rounded-md px-3 py-2 no-underline">
      Welcome to Peers!
    </span>
  );
}
