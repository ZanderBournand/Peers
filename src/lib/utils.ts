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

export function countdownDays(inputDate: Date) {
  const currentDate = new Date();
  const diffTime = Math.abs(inputDate.getTime() - currentDate.getTime());

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
  const diffMinutes = Math.floor((diffTime / (1000 * 60)) % 60);

  let countdownText;
  if (diffDays === 0) {
    if (diffHours === 0) {
      countdownText = `In ${diffMinutes} minutes`;
    } else {
      countdownText = `In ${diffHours} hours`;
    }
  } else if (diffDays < 7) {
    countdownText = `In ${diffDays} days`;
  } else {
    const diffWeeks = Math.floor(diffDays / 7);
    countdownText = `In ${diffWeeks} weeks`;
  }

  return countdownText;
}

export function formattedDuration(inputDurations: number) {
  const hours = Math.floor(inputDurations / 60);
  const minutes = inputDurations % 60;
  let formattedDuration = "";

  if (hours > 0 && minutes > 0) {
    formattedDuration = `${hours} hour ${minutes} mins`;
  } else if (hours > 0 && minutes === 0) {
    formattedDuration = `${hours} hour`;
  } else {
    formattedDuration = `${minutes} mins`;
  }

  return formattedDuration;
}

export interface formattedAddress {
  main: string;
  secondary: string;
}

export function formattedAddressObj(address: string | null | undefined) {
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
