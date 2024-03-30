import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserData } from "@/lib/interfaces/userData";
import { type EventData } from "./interfaces/eventData";
import moment from "moment";
import { type EventData } from "./interfaces/eventData";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(inputString: string) {
  const lowercaseString = inputString.toLowerCase();

  const capitalizedString =
    lowercaseString.charAt(0).toUpperCase() + lowercaseString.slice(1);

  return capitalizedString;
}

export function getDisplayName(user: UserData, fullName = true) {
  if (user.firstName && user.lastName) {
    return `${user.firstName}` + (fullName ? ` ${user.lastName}` : "");
  } else {
    return "@" + user.username;
  }
}

export function pluralize(value: number, unit: string) {
  return `${value} ${value === 1 ? unit : unit + "s"}`;
}

export function getFormattedDuration(inputDurations: number) {
  const hours = Math.floor(inputDurations / 60);
  const minutes = inputDurations % 60;

  let formattedDuration = "";

  if (hours > 0 && minutes > 0) {
    formattedDuration = `${pluralize(hours, "hour")} ${pluralize(
      minutes,
      "min",
    )}`;
  } else if (hours > 0 && minutes === 0) {
    formattedDuration = pluralize(hours, "hour");
  } else {
    formattedDuration = pluralize(minutes, "min");
  }

  return formattedDuration;
}

export function shouldDisplayJoinButton(
  eventDate: Date,
  eventDuration: number,
): string {
  // Convert event date and duration to moment objects
  const eventStart = moment(eventDate);
  const tenMinutesBeforeStart = eventStart.clone().subtract(10, "minutes");

  const eventEnd = eventStart.clone().add(eventDuration, "minutes");

  const now = moment();
  // Check if the current time is within the event duration or within the next 10 minutes
  return now.isBetween(tenMinutesBeforeStart, eventEnd)
    ? "live"
    : now.isBefore(tenMinutesBeforeStart)
      ? "upcoming"
      : "ended";
}

export function formatEnumName(tagName: string) {
  // Replace underscores with spaces and convert to title case
  let formatted = tagName
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());

  // Replace "And" with "&"
  formatted = formatted.replace("And", "&");

  return formatted;
}

export function sortUpcomingEvents(events: EventData[]): EventData[] {
  return events
    .filter((event) => {
      const endDate = moment(event.date).add(event.duration, "minutes");
      return moment().isBefore(endDate);
    })
    .sort((a, b) => moment(a.date).diff(moment(b.date)));
}

export const eventCountdownTime = (
  eventDate: Date,
  durationInMinutes: number,
) => {
  const diffMs = eventDate.getTime() - new Date().getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

  return diffMs <= 0
    ? new Date() <= new Date(eventDate.getTime() + durationInMinutes * 60000)
      ? "live now!"
      : "this event has ended"
    : diffDays === 0
      ? diffHours === 0
        ? `in ${pluralize(diffMinutes, "minute")}`
        : `in ${pluralize(diffHours, "hour")}`
      : `in ${pluralize(
          diffDays < 7 ? diffDays : Math.floor(diffDays / 7),
          diffDays < 7 ? "day" : "week",
        )}`;
};
