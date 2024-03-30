import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { api } from "@/trpc/server";
import { eventCountdownTime, getDisplayName } from "@/lib/utils";
import EventSection from "@/components/events/EventSection";
import EventCategories from "@/components/events/EventCategories";
import HostSection from "@/components/events/HostSection";
import EventCalendar from "@/components/events/EventCalendar";
import StatusPing from "@/components/events/StatusPing";
import { type UserData } from "@/lib/interfaces/userData";
import { type EventData } from "@/lib/interfaces/eventData";
import moment from "moment";

export default async function AuthButton() {
  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userData = user && (await api.users.getUser.query({}));
  const userEvents: EventData[] =
    (await api.events.getEventsAttending.query({})) ?? [];

  const recommendedEvents: EventData[] =
    (user && (await api.events.getRecommended.query({}))) ?? [];
  const universityEvents: EventData[] =
    (user &&
      (await api.events.getUniversity.query({
        university: userData?.university ?? "",
      }))) ??
    [];

  const recommendedHosts =
    (await api.events.getRecommendedHosts.query({ userId: user?.id ?? "" })) ??
    [];

  const nextEvent = userEvents
    .filter((event) =>
      moment(event.date).add(event.duration, "minutes").isAfter(moment()),
    )
    .reduce(
      (next, event) =>
        moment(event.date).isBefore(moment(next?.date)) ? event : next,
      userEvents[0],
    );

  const nextEventCountdown =
    nextEvent && eventCountdownTime(nextEvent.date, nextEvent.duration);

  return user && userData ? (
    <div className="flex items-center justify-center pb-32">
      <div className="mt-16 flex max-w-screen-2xl flex-col">
        <div className="flex flex-col items-center">
          <p className="text-3xl font-bold">
            Hey, {getDisplayName(userData as UserData, false)}!
          </p>
          <div className="mt-2 flex flex-row items-center text-2xl font-semibold text-gray-800">
            {nextEvent ? (
              <>
                Your next event is
                {nextEventCountdown?.includes("in") && " in"}
                <StatusPing eventType={nextEvent.type} />
                {nextEventCountdown?.includes("in")
                  ? nextEventCountdown.split("in")[1]
                  : nextEventCountdown}
              </>
            ) : (
              <>No events planned? Start learning!</>
            )}
          </div>
        </div>
        <div className="mt-12 flex w-full flex-row">
          <div className="flex w-9/12 flex-shrink-0 flex-col">
            <div className="flex w-11/12 flex-col">
              <EventSection
                title="Recommended Events"
                events={recommendedEvents}
                redirect="/feed/recommendations"
              />
              <EventSection
                title="University of Florida"
                events={universityEvents}
                redirect="/feed/university"
              />
              <EventCategories />
              <HostSection hosts={recommendedHosts} />
            </div>
          </div>
          <div className="sticky top-0 mt-6 flex w-3/12 flex-shrink-0 flex-col items-center">
            <div className="sticky top-24 flex flex-col rounded-xl border px-4 py-2 shadow-sm">
              <EventCalendar events={userEvents} />
            </div>
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
