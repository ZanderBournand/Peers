export interface UniversityData {
  name: string;
  webPages: string[];
  alphaTwoCode?: string | null;
  stateProvince?: string | null;
  domains: string[];
  country?: string | null;
  logo?: string | null;
  isLogoUploaded: boolean;
}
