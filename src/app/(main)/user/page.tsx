import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { capitalizeFirstLetter } from "@/lib/utils";
import { api } from "@/trpc/server";

export default async function UserPage() {
  const user = await api.users.getCurrent.query();

  if (!user) return null;

  return (
    <div className="flex w-full justify-center ">
      <Card className="mt-12 w-full max-w-xl">
        <CardHeader>
          <CardTitle>
            {user.firstName} {user.firstName}
          </CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Role: {capitalizeFirstLetter(user.role)}</p>
        </CardContent>
        <CardContent className="flex items-center">
          <p className="pr-1">Skills:</p>
          {user.skills.map((skill, index) => (
            <p
              key={index}
              className="w-min rounded-full border border-border px-2 py-0.5"
            >
              {skill}
            </p>
          ))}
        </CardContent>
        <CardContent>
          <p>Bio: {user.bio}</p>
        </CardContent>
        <div className="flex">
          <CardContent>
            <p>Github: {user.github}</p>
          </CardContent>
          <CardContent>
            <p>Linkedin: {user.linkedin}</p>
          </CardContent>
          <CardContent>
            <p>Website: {user.website}</p>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}