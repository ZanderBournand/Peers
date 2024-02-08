import { z } from "zod";
import { EventType } from "@prisma/client";

export const newEventSchema = z.object({
  title: z.string().min(1),
  location: z.string().min(1).optional(),
  date: z.date(),
  description: z.string().min(1),
  image: z.string().url().optional(),
  type: z.nativeEnum(EventType),
  duration: z.number().int().min(1),
});
