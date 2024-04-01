import { type OrganizationType } from "@prisma/client";

export interface OrganizationData {
    id: string;
    name: string;
    description: string;
    email?: string | null;
    university?: string | null;
    type: OrganizationType;
    image?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    discord?: string | null;
  }
