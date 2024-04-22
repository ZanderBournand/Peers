/*
  File -> Display page for a user's profile
  - Displays user's profile information, including PeerPoints earned, bio, interests, socials, verified student status & more
  - Also shows the user's organiations, events they are hosting & attending (through small carousels)
  - Actions include editing the user's profile, verifying student status & creating organizations/events
*/

import { api } from "@/trpc/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import { PiStudentFill } from "react-icons/pi";
import UserPageEventCarousel from "@/components/events/UserPageEventCarousel";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import Image from "next/image";
import VerifyStudentButton from "@/components/user/verifyStudentButton";
import UserPageOrganizationCarousel from "@/components/organizations/UserPageOrgCarousel";
import {
  BoltIcon,
  CheckCircleIcon,
  HomeIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import VerifyOrNavigateContainer from "@/components/user/VerifyOrNavigateContainer";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getDisplayName } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function PeerPage({ params }: { params: { id: string } }) {
  const actualUser = await api.users.getUser.query({});
  const user = await api.users.getUser.query({ id: params.id });

  const isCurrentUser = actualUser?.id === user?.id;

  const userOrganizations = await api.organizations.getAdminOrgs.query({
    userId: user?.id ?? "",
  });
  const eventsAttending = await api.events.getEventsAttending.query({
    id: params.id,
  });
  const eventsHosting = await api.events.getEventsHosting.query({
    id: params.id,
  });

  if (!user) return null;

  return (
    <>
      <div className="flex flex-col items-center justify-center pb-32 pt-8 lg:flex-row lg:items-start">
        <div className="flex-col">
          <div className="mt-4 flex h-64 w-80 flex-col items-center justify-center rounded-t-xl border border-slate-300">
            <Avatar className="size-20 hover:cursor-pointer">
              <AvatarImage src={user.image ?? ""} />
              <AvatarFallback>Peer</AvatarFallback>
            </Avatar>
            {user.firstName && user.lastName ? (
              <>
                <div
                  className="mt-2 flex flex-row items-center"
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "bold",
                  }}
                >
                  {user.firstName} {user.lastName}
                  {user.isVerifiedStudent && (
                    <CheckBadgeIcon
                      className="blue blue-500 ml-1 h-6 w-6"
                      color="#6e13c8"
                    />
                  )}
                </div>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "gray",
                  }}
                >
                  {user.username}
                </p>
              </>
            ) : (
              <div
                className="mt-2 flex flex-row items-center"
                style={{
                  fontSize: "1.25rem",
                  color: "gray",
                }}
              >
                {user.username}
                {user.isVerifiedStudent && (
                  <CheckBadgeIcon
                    className="blue blue-500 ml-1 h-6 w-6"
                    color="#6e13c8"
                  />
                )}
              </div>
            )}
            <div className="mt-4 flex flex-col items-center">
              {user.isVerifiedStudent && (
                <div>
                  <p
                    className="flex items-center"
                    style={{
                      fontSize: "1.01rem",
                    }}
                  >
                    {user?.university?.isLogoUploaded ? (
                      <Image
                        src={user?.university?.logo ?? ""}
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
                    {user?.university?.name}
                  </p>
                </div>
              )}
              <div className="mr-2 mt-1 flex w-max flex-row items-center justify-center rounded-lg bg-purple-100/30 px-2 py-1 text-purple-900">
                <BoltIcon className="mr-1 h-5 w-5" />
                <p
                  style={{
                    fontSize: "1.01rem",
                  }}
                >
                  {user.points} PeerPoints
                </p>
              </div>
            </div>
          </div>
          <div className="w-80 border border-t-0 border-slate-300 px-2 py-3">
            <div className="flex justify-center">
              <b style={{ fontSize: "1.25rem" }}>Bio</b>
            </div>
            <div className="mt-2 px-3">
              {user.bio ? (
                <p>{user.bio}</p>
              ) : (
                <p className="text-center" style={{ fontSize: "0.8rem" }}>
                  This user has not provided a bio
                </p>
              )}
            </div>
            <div className="mt-4 flex flex-row flex-wrap gap-y-2">
              {user?.interests?.slice(0, 3).map((interest) => (
                <div
                  key={interest.id}
                  className="mr-2 rounded-lg bg-purple-100/30 px-4 py-1 text-xs text-slate-600"
                >
                  {interest.name}
                </div>
              ))}
              {user.interests?.length > 3 && (
                <HoverCard>
                  <HoverCardTrigger>
                    <p className="cursor-pointer px-4 py-1 text-xs text-slate-800 hover:underline">
                      +{user.interests.length - 3}
                    </p>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-[350px]">
                    <div className="flex flex-col">
                      <p className="ml-2 font-semibold">
                        {getDisplayName(user, false)}&rsquo;s interests
                      </p>
                      <div className="mt-3 flex flex-row flex-wrap gap-y-2">
                        {user?.interests.map((interest) => (
                          <div
                            key={interest.id}
                            className="mr-2 rounded-lg bg-purple-100/30 px-4 py-1 text-xs text-slate-600"
                          >
                            {interest.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          </div>
          <div className="flex w-80 flex-col items-center justify-center rounded-b-xl border border-t-0 border-slate-300 py-2 shadow-sm">
            <b style={{ fontSize: "1.25rem" }}>Links</b>
            <div
              style={{ fontSize: "0.8rem" }}
              className="mt-2 flex w-full flex-col items-start justify-start px-6"
            >
              {!user.github && !user.linkedin && !user.website ? (
                <div className="mt-2">
                  This user has not provided any personal links
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
                      Website
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

        <div className="mt-8 w-full flex-col lg:ml-20 lg:mt-4 lg:w-[600px]">
          <div className="flex items-center justify-center px-4">
            <Card className="w-full max-w-[600px] rounded-xl border border-slate-300 p-4 shadow-sm">
              <CardHeader className="ml-5 flex items-center justify-center p-4 text-center text-xl font-bold">
                <div className="flex flex-row items-center">
                  <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                    Organizations
                  </span>
                  {isCurrentUser && (
                    <VerifyOrNavigateContainer
                      user={user}
                      elementId="create-organization-link"
                      navigationLink="/organization/new"
                    >
                      <PlusCircleIcon className="h-6 w-6" />
                    </VerifyOrNavigateContainer>
                  )}
                </div>
              </CardHeader>
              {userOrganizations.length == 0 ? (
                <CardContent className="mt-4 text-center">
                  This user is not part of any organizations
                </CardContent>
              ) : (
                <CardContent className="flex justify-center">
                  <UserPageOrganizationCarousel
                    organizations={userOrganizations}
                  />
                </CardContent>
              )}
            </Card>
          </div>

          <div className="flex items-center justify-center px-4">
            <Card className="mt-6 w-full max-w-[600px] rounded-xl border border-slate-300 p-4 shadow-sm">
              <CardHeader className="ml-5 flex items-center justify-center p-4 text-center text-xl font-bold">
                <div className="flex flex-row items-center">
                  <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                    Events
                  </span>
                  {isCurrentUser && (
                    <VerifyOrNavigateContainer
                      user={user}
                      elementId="create-event-link"
                      navigationLink="/event/new"
                    >
                      <PlusCircleIcon className="h-6 w-6" />
                    </VerifyOrNavigateContainer>
                  )}
                </div>
              </CardHeader>
              <CardContent className="mt-2 flex w-full flex-col items-center justify-center">
                <Tabs
                  defaultValue="hosting"
                  className="flex w-full max-w-[550px] flex-col items-center"
                >
                  <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                    <TabsTrigger value="hosting">
                      <div className="flex flex-row items-center">
                        <HomeIcon className="mr-1 h-5 w-5" />
                        Hosting
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="attending">
                      <div className="flex flex-row items-center">
                        <CheckCircleIcon className="mr-1 h-5 w-5" />
                        Attending
                      </div>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="hosting" className="mt-2 w-full">
                    <div className="flex w-full flex-col items-center">
                      {eventsHosting.length !== 0 ? (
                        <div className="flex w-full justify-center">
                          <UserPageEventCarousel events={eventsHosting} />
                        </div>
                      ) : (
                        <p className="my-6 text-center">
                          This user is not hosting any events
                        </p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="attending" className="mt-2 w-full">
                    <div className="flex w-full flex-col items-center">
                      {eventsAttending.length !== 0 ? (
                        <div className="flex w-full justify-center">
                          <UserPageEventCarousel events={eventsAttending} />
                        </div>
                      ) : (
                        <p className="my-6 text-center">
                          This user is not attending any events
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
