import { z } from "zod";
import { EventType } from "@prisma/client";
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
