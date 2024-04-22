/*
  File -> Typescript type for organization data
*/

import { type UniversityData } from "./universityData";
import { type OrganizationType } from "@prisma/client";
import { type UserData } from "./userData";

export interface OrganizationData {
  id: string;
  name: string;
  type: OrganizationType;
  description: string;
  image: string;
  email: string | null;
  instagram?: string | null;
  facebook?: string | null;
  discord?: string | null;
  universityName?: string | null;
  university?: UniversityData | null;
  admins?: UserData[];
}
