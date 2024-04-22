/*
  File -> Typescript type for tag data
*/

import { type TagCategory } from "@prisma/client";

export interface TagData {
  id: string;
  category: TagCategory;
  name: string;
}
