import { api } from "@/trpc/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VerifyStudentButton from "@/components/user/verifyStudentButton";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";

const cardStyle = {
  width: "580px",
  padding: 10,
  borderRadius: 10,
  border: "4px solid grey",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

export default async function UserPage() {
  const user = await api.users.getCurrent.query();

  const userImage = user?.image ?? "";

  if (!user) return null;

  return (
    <>
      <div className="flex items-start justify-center">
        <div className="flex-col">
          <div
            className="mt-4 flex h-48 w-80 flex-col items-center justify-center border-2"
            style={{
              border: "4px solid grey",
              borderBottom: "0px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <Avatar className="size-20 hover:cursor-pointer">
              <AvatarImage src={userImage} />
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
              Student Status:{" "}
              {user.isVerifiedStudent ? "Verified" : "Not Verified"}
            </p>
          </div>
          <div
            className="w-80 border-2 px-5 py-2"
            style={{
              marginTop: "-4px",
              border: "4px solid grey",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p>{user.bio}</p>
          </div>
          <div
            className="flex w-80 flex-col items-center justify-center border-2 py-2"
            style={{
              marginTop: "-4px",
              border: "4px solid grey",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              borderTop: "0px",
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            <b style={{ fontSize: "1.25rem" }}>Links</b>
            <div style={{ fontSize: "0.8rem" }}>
              {!user.github && !user.linkedin && !user.website ? (
                <div className="mt-2">
                  This user has not provided any personal links.
                </div>
              ) : null}
              <div className="mb-2 mt-2 flex">
                {user.github && (
                  <div className="flex">
                    <FaGithub className="h-5 w-5" />
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "underline",
                        marginRight: "15px",
                        marginLeft: "3px",
                      }}
                      href={user.github}
                    >
                      GitHub
                    </a>
                  </div>
                )}
                {user.linkedin && (
                  <div className="flex">
                    <FaLinkedin className="h-5 w-5" />
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "underline",
                        marginRight: "15px",
                        marginLeft: "3px",
                      }}
                      href={user.linkedin}
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
                {user.website && (
                  <div className="flex">
                    <IoPersonCircleSharp className="h-5 w-5" />
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "underline",
                        marginRight: "10px",
                        marginLeft: "3px",
                      }}
                      href={user.website}
                    >
                      Personal Website
                    </a>
                  </div>
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
          <div className="flex items-center justify-center">
            <Card style={cardStyle}>
              <CardHeader
                className="ml-5 flex items-center justify-center text-center"
                style={{
                  padding: 7,
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                }}
              >
                <div className="flex">
                  <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                    Organizations
                  </span>
                  <Link href="/organization/new">
                    <Button
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "1px",
                        marginLeft: "6px",
                        marginTop: "7px",
                        backgroundColor: "grey",
                      }}
                      title="Create Organization"
                    >
                      <PlusIcon style={{ width: "24px", height: "24px" }} />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                This user is not part of any organizations.
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-center">
            <Card className="mt-3" style={cardStyle}>
              <CardHeader
                className="ml-5 flex items-center justify-center text-center"
                style={{
                  padding: 7,
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                }}
              >
                <div className="flex">
                  <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                    Events
                  </span>
                  <Link href="/event/new">
                    <Button
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "1px",
                        marginLeft: "6px",
                        marginTop: "7px",
                        backgroundColor: "grey",
                      }}
                      title="Create Event"
                    >
                      <PlusIcon style={{ width: "24px", height: "24px" }} />
                    </Button>
                  </Link>
                </div>
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
