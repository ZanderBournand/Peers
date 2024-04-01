import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserData } from "@/lib/interfaces/userData";
import moment from "moment";

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

export function getAddressSections(fullAddress: string | null | undefined) {
  if (fullAddress) {
    const parts = fullAddress.split(",");
    let address = null,
      city = null,
      state = null;

    if (parts.length === 5) {
      address = parts[1]?.trim();
      city = parts[2]?.trim();
      state = parts[3]?.trim();
    } else if (parts.length === 4) {
      city = parts[1]?.trim();
      state = parts[2]?.trim();
    }

    return {
      place: parts[0] ?? "",
      address: address ?? null,
      city: city ?? "",
      state: state ?? "",
    };
  }
  return null;
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
