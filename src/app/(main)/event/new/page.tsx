import EventForm from "@/components/forms/EventForm";
import { api } from "@/trpc/server";

export default async function CreateEvent() {
  const user = await api.users.getCurrent.query();
  const allTags = await api.tags.getAll.query();

  return <EventForm user={user} allTags={allTags} />;
}
