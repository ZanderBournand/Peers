import { type TagData } from "./tagData";
import { type UniversityData } from "./universityData";

export interface UserData {
  image: string;
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  interests?: TagData[] | null;
  bio: string | null;
  github: string | null;
  linkedin: string | null;
  website: string | null;
  isVerifiedStudent: boolean;
  universityName?: string | null;
  university?: UniversityData | null;
}
