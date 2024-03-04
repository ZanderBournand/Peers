import { type EventType } from "@prisma/client";
import { type TagData } from "./tagData";
import { type OrganizationData } from "./organizationData";
import { type UserData } from "./userData";

export interface EventData {
  id: string;
  title: string;
  description: string;
  location?: string | null;
  locationDetails?: string | null;
  date: Date;
  image?: string | null;
  type: EventType;
  duration: number;
  tags?: TagData[] | null;
  attendees?: UserData[] | null;
  userHostId?: string | null;
  userHost?: UserData | null;
  orgHostId?: string | null;
  orgHost?: OrganizationData | null;
}
