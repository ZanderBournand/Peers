import { api } from "@/trpc/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VerifyStudentButton from "@/components/user/verifyStudentButton";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import { PiStudentFill } from "react-icons/pi";
import UserPageOrgCarousel from "@/components/organizations/UserPageOrgCarousel";
import { FaCirclePlus } from "react-icons/fa6";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import UserPageEventCarousel from "@/components/events/UserPageEventCarousel";
import { Separator } from "@/components/ui/separator";

const cardStyle = {
  width: "580px",
  padding: 10,
  borderRadius: 10,
  border: "1px solid grey",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

export default async function UserPage() {
  const user = await api.users.getCurrent.query({});

  const eventsAttending = await api.users.getEventsAttending.query({});
  const eventsHosting = await api.users.getEventsHosting.query({});
  const organizationsAdmin =
    await api.organizations.getAdminOrganizations.query({ userId: user.id });

  const userImage = user?.image ?? "";

  if (!user) return null;

  return (
    <>
      <div className="flex items-start justify-center">
        <div className="flex-col">
          <div
            className="mt-4 flex h-56 w-80 flex-col items-center justify-center border-2"
            style={{
              border: "1px solid grey",
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
            {user.isVerifiedStudent && (
              <div>
                <p
                  className="mr-2 flex"
                  style={{
                    fontSize: "1.01rem",
                  }}
                >
                  <CheckBadgeIcon
                    className="blue blue-500 mr-1 h-6 w-6"
                    color="#6e13c8"
                  />
                  Verified Student
                </p>
                <p
                  className="flex items-center"
                  style={{
                    fontSize: "1.01rem",
                  }}
                >
                  <PiStudentFill className="-ml-2 mr-1 h-5 w-5" />
                  {user.university}
                </p>
              </div>
            )}
          </div>
          <div
            className="w-80 border-2 px-5 py-2"
            style={{
              marginTop: "-1px",
              border: "1px solid grey",
              borderTop: "0px",
            }}
          >
            <p>{user.bio}</p>
          </div>
          <div
            className="flex w-80 flex-col items-center justify-center border-2 py-2"
            style={{
              marginTop: "-1px",
              border: "1px solid grey",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              borderTop: "1px",
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
              <CardHeader className="ml-5 flex items-center justify-center p-4 text-center text-xl font-bold">
                <div className="flex">
                  <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                    Organizations
                  </span>
                  <Link
                    className="color-grey ml-2 mt-1"
                    href="/organization/new"
                    title="Create Organization"
                  >
                    <FaCirclePlus />
                  </Link>
                </div>
              </CardHeader>
              {organizationsAdmin.length == 0 ? (
                <CardContent className="text-center">
                  This user is not part of any organizations.
                </CardContent>
              ) : (
                <CardContent>
                  <div className="font-bold">Their orgs:</div>
                  <UserPageOrgCarousel organizations={organizationsAdmin} />
                </CardContent>
              )}
            </Card>
          </div>

          <div className="flex items-center justify-center">
            <Card className="mt-3" style={cardStyle}>
              <CardHeader className="ml-5 flex items-center justify-center p-4 text-center text-xl font-bold">
                <div className="flex">
                  <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                    Events
                  </span>
                  <Link
                    className="color-grey ml-2 mt-1"
                    href="/event/new"
                    title="Create Event"
                  >
                    <FaCirclePlus />
                  </Link>
                </div>
              </CardHeader>
              {eventsAttending.length == 0 ? (
                <CardContent className="mb-2 text-center">
                  This user is not registered for any events.
                </CardContent>
              ) : (
                <CardContent>
                  <div className="font-bold">Upcoming Events:</div>
                  <UserPageEventCarousel events={eventsAttending} />
                </CardContent>
              )}
              <Separator className="mx-auto -mt-6 mb-2 w-5/6 bg-gray-400" />
              {eventsHosting.length == 0 ? (
                <CardContent className="text-center">
                  This user is not hosting any events.
                </CardContent>
              ) : (
                <CardContent>
                  <div className="font-bold">Hosting Events:</div>
                  <UserPageEventCarousel events={eventsHosting} />
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
