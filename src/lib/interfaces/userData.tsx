export interface UserData {
  image: string | null;
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  skills: string[];
  bio: string | null;
  github: string | null;
  linkedin: string | null;
  website: string | null;
  isVerifiedStudent: boolean;
}
