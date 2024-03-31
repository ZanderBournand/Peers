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
import moment from "moment";

export default async function AuthButton() {
  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userData = user && (await api.users.getUser.query({}));

  const userEventsPromise = api.events.getEventsAttending.query({});
  const recommendedEventsPromise = user && api.events.getRecommended.query({});
  const universityEventsPromise =
    user &&
    api.events.getUniversity.query({
      university: userData?.university ?? "",
    });
  const recommendedHostsPromise = api.events.getRecommendedHosts.query({});

  const [userEvents, recommendedEvents, universityEvents, recommendedHosts] =
    await Promise.all([
      userEventsPromise,
      recommendedEventsPromise,
      universityEventsPromise,
      recommendedHostsPromise,
    ]);

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
        <div className="flex w-full flex-col items-center md:flex-row md:items-start">
          <div className="order-2 mt-10 flex w-full flex-shrink-0 flex-col md:order-1 md:w-9/12">
            <div className="flex w-full flex-col md:w-11/12">
              {recommendedEvents && recommendedEvents?.length > 0 && (
                <EventSection
                  title="Recommended Events"
                  events={recommendedEvents}
                  redirect="/feed/recommendations"
                />
              )}
              {universityEvents && universityEvents?.length > 0 && (
                <EventSection
                  title="University of Florida"
                  events={universityEvents}
                  redirect="/feed/university"
                />
              )}
              <EventCategories />
              {recommendedHosts &&
                (recommendedHosts?.users?.length > 0 ||
                  recommendedHosts?.organizations?.length > 0) && (
                  <HostSection hosts={recommendedHosts} />
                )}
            </div>
          </div>
          <div className="order-1 mt-10 flex w-3/12 flex-shrink-0 flex-col items-center md:sticky md:top-0 md:order-2 md:mt-16">
            <div className="flex  flex-col rounded-xl border px-4 py-2 shadow-sm md:sticky md:top-24">
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
