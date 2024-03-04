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
