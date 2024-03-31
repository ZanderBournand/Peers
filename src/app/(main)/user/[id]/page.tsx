import { api } from "@/trpc/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import { PiStudentFill } from "react-icons/pi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import UserPageEventCarousel from "@/components/events/UserPageEventCarousel";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import Image from "next/image";
import VerifyStudentButton from "@/components/user/verifyStudentButton";

const cardStyle = {
  width: "580px",
  padding: 10,
  borderRadius: 10,
  border: "1px solid grey",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

export default async function PeerPage({ params }: { params: { id: string } }) {
  const actualUser = await api.users.getUser.query({});
  const user = await api.users.getUser.query({ id: params.id });

  const isCurrentUser = actualUser?.id === user?.id;

  const eventsAttending = await api.events.getEventsAttending.query({
    id: params.id,
  });
  const eventsHosting = await api.events.getEventsHosting.query({
    id: params.id,
  });

  const university = await api.universities.getUniversity.query({
    name: user.university ?? "",
  });

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
              <AvatarImage src={user.image ?? ""} />
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
                  {university?.is_logo_uploaded ? (
                    <Image
                      src={university.logo ?? ""}
                      alt="selected image"
                      width={20}
                      height={20}
                      style={{
                        objectFit: "cover",
                      }}
                      className="mr-2 rounded transition-opacity duration-500 group-hover:opacity-70"
                    />
                  ) : (
                    <PiStudentFill className="mr-2" />
                  )}
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
          {isCurrentUser && (
            <div>
              <div className="mt-3 flex w-80 justify-center py-2">
                <Link href="/user/edit">
                  <Button>
                    <MdEdit color="white" className="mr-2 h-5 w-5" />
                    Edit Profile
                  </Button>
                </Link>
              </div>

              {!user.isVerifiedStudent && (
                <div className="mt-2 flex w-80 justify-center py-2">
                  <VerifyStudentButton />
                </div>
              )}
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
                  {isCurrentUser && (
                    <Link
                      className="color-grey ml-1.5 mt-1.5"
                      href="/organization/new"
                      title="Create Organization"
                    >
                      <AiOutlinePlusCircle className="color-grey" />
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent className="text-center">
                This user is not part of any organizations.
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-center">
            <Card className="mt-3" style={cardStyle}>
              <CardHeader className="ml-5 flex items-center justify-center p-4 text-center text-xl font-bold">
                <div className="flex">
                  <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                    Events
                  </span>
                  {isCurrentUser && (
                    <Link
                      className="color-grey ml-1.5 mt-1.5"
                      href="/event/new"
                      title="Create Event"
                    >
                      <AiOutlinePlusCircle className="color-grey" />
                    </Link>
                  )}
                </div>
              </CardHeader>
              {eventsAttending.length == 0 ? (
                <CardContent className="mb-1 text-center">
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
