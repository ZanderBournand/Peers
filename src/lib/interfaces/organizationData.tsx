export interface OrganizationData {
  id: string;
  name: string;
  description: string;
  email?: string | null;
  type: string;
  image?: string | null;
}
