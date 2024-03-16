import { z } from "zod";
import { EventType } from "@prisma/client";
import { UserSchema } from "./User";
import { OrganizationSchema } from "./Organizations";
import { TagSchema } from "./Tag";

export const newEventSchema = z.object({
  title: z.string().min(1),
  location: z.string().min(1).optional().nullable(),
  locationDetails: z.string().min(1).optional().nullable(),
  date: z.date(),
  description: z.string().min(1),
  image: z.string().url(),
  type: z.nativeEnum(EventType),
  duration: z.number().int().min(1),
  tags: TagSchema.array().optional().nullable(),
  userHostId: z.string().optional().nullable(),
  orgHostId: z.string().optional().nullable(),
});

export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  location: z.string().optional().nullable(),
  locationDetails: z.string().optional().nullable(),
  date: z.date(),
  description: z.string(),
  image: z.string().url().optional().nullable(),
  type: z.nativeEnum(EventType),
  duration: z.number().int(),
  tags: TagSchema.array().optional().nullable(),
  attendees: UserSchema.array().optional().nullable(),
  userHostId: z.string().optional().nullable(),
  userHost: UserSchema.optional().nullable(),
  orgHostId: z.string().optional().nullable(),
  orgHost: OrganizationSchema.optional().nullable(),
});
