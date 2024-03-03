import { api } from "@/trpc/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VerifyStudentButton from "@/components/buttons/verifyStudentButton";
import Link from "next/link";

const cardStyle = {
  width: "580px",
  padding: 10,
  borderRadius: 10,
  border: "4px solid #e6b3ff",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

export default async function UserPage() {
  const user = await api.users.getCurrent.query();

  if (!user) return null;

  return (
    <>
      <div className="flex items-start justify-center">
        <div className="flex-col">
          <div className="mt-4 flex h-48 w-80 flex-col items-center justify-center border-2">
            <Avatar className="size-20 hover:cursor-pointer">
              <AvatarImage src="https://wallpapers.com/images/high/funny-profile-picture-7k1legjukiz1lju7.webp" />
              <AvatarFallback>Peer</AvatarFallback>
            </Avatar>
            <p
              className="mt-2"
              style={{
                fontSize: "1.75rem",
                fontWeight: "bold",
              }}
            >
              {user.firstName} {user.lastName}
            </p>
            <p
              style={{
                fontSize: "1rem",
                color: "gray",
              }}
            >
              {user.username}
            </p>
            <p
              style={{
                fontSize: "1.01rem",
              }}
            >
              Verification Status:{" "}
              {user.isVerifiedStudent ? "Verified" : "Not Verified"}
            </p>
          </div>
          <div className="w-80 border-2 px-5 py-2">
            <p>{user.bio}</p>
          </div>
          <div className="flex w-80 flex-col items-center justify-center border-2 py-2">
            <b style={{ fontSize: "1.25rem" }}>Links</b>
            <div style={{ fontSize: "0.8rem" }}>
              {!user.github && !user.linkedin && !user.website ? (
                <div className="mt-2">
                  This user has not provided any personal links.
                </div>
              ) : null}
              <div className="mt-2 flex">
                {user.github && (
                  <a
                    style={{ textDecoration: "underline", marginRight: "10px" }}
                    href={user.github}
                  >
                    GitHub
                  </a>
                )}
                {user.linkedin && (
                  <a
                    style={{ textDecoration: "underline", marginRight: "10px" }}
                    href={user.linkedin}
                  >
                    LinkedIn
                  </a>
                )}
                {user.website && (
                  <a
                    style={{ textDecoration: "underline", marginRight: "10px" }}
                    href={user.website}
                  >
                    Personal Website
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 flex w-80 justify-center py-2">
            <Link href="/user/edit">
              <Button variant="default">Edit Profile</Button>
            </Link>
          </div>

          {!user.isVerifiedStudent && (
            <div className="mt-2 flex w-80 justify-center py-2">
              <VerifyStudentButton />
            </div>
          )}
        </div>

        <div className="ml-20 mt-4 flex-col">
          <div>
            <Card style={cardStyle}>
              <CardHeader
                className="text-center"
                style={{
                  padding: 7,
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "purple",
                }}
              >
                Organizations
              </CardHeader>
              <CardContent className="text-center">
                This user is not part of any organizations.
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="mt-3" style={cardStyle}>
              <CardHeader
                className="text-center"
                style={{
                  padding: 7,
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "purple",
                }}
              >
                Events
              </CardHeader>
              <CardContent className="text-center">
                This user is not registered for any events.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
