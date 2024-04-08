import { type UserData } from "./userData";
export interface UniversityData {
  name: string;
  webPages: string[];
  alphaTwoCode?: string;
  stateProvince?: string;
  domains: string[];
  country?: string;
  logo?: string;
  isLogoUploaded: boolean;
  students: UserData[];
}
