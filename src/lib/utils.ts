import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(inputString: string) {
  const lowercaseString = inputString.toLowerCase();

  const capitalizedString =
    lowercaseString.charAt(0).toUpperCase() + lowercaseString.slice(1);

  return capitalizedString;
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

export function getFormattedAddress(address: string | null | undefined) {
  if (address) {
    const parts = address.split(",");
    let secondary = "";
    if (parts.length === 5) {
      secondary = `${parts[1]?.trim()} · ${parts[2]?.trim()}, ${parts[3]?.trim()}`;
    } else if (parts.length === 4) {
      secondary = `${parts[1]?.trim()}, ${parts[2]?.trim()}`;
    }
    return {
      main: parts[0]?.trim() ?? "",
      secondary: secondary,
    };
  }
  return null;
}
