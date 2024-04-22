import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { type z } from "zod";
import { type newOrgSchema } from "@/lib/validators/Organization";
import { api } from "@/trpc/server";
import { type OrganizationData } from "@/lib/interfaces/organizationData";
import { Separator } from "@/components/ui/separator";
import { PiStudentFill } from "react-icons/pi";
import { FaDiscord, FaEnvelope, FaFacebook, FaInstagram } from "react-icons/fa";
import AdminsDialog from "@/components/organizations/AdminsDialog";
import { MdEdit } from "react-icons/md";
import { headers } from "next/headers";
import ShareButton from "@/components/organizations/ShareButton";
import { formatEnumName } from "@/lib/utils";
import EventPreview from "@/components/events/EventPreview";
import { PlusIcon } from "@heroicons/react/24/outline";

export type NewOrgInput = z.infer<typeof newOrgSchema>;

export default async function OrgPage({ params }: { params: { id: string } }) {
  const user = await api.users.getUser.query({});
  const organization: OrganizationData =
    await api.organizations.getOrganization.query({
      id: params.id,
    });
  const events = await api.events.getOrgEvents.query({
    orgId: organization.id,
  });

  const organizationLink = headers().get("x-url");
  const isAdmin = organization?.admins?.some((admin) => admin.id === user.id);

  return (
    <div className="flex items-center justify-center pb-32">
      <div className="mt-12 flex w-full max-w-screen-2xl flex-col px-2 pr-12 lg:px-12">
        <div className="flex flex-col lg:flex-row">
          <div
            className="ml-8 flex items-center lg:ml-0"
            style={{ minWidth: "200px" }}
          >
            <Image
              src={organization.image}
              alt="selected image"
              width={200}
              height={200}
              style={{
                objectFit: "cover",
              }}
              className="mr-3 rounded-lg transition-opacity duration-500 group-hover:opacity-70"
            />
          </div>
          <div className="ml-8 mt-8 flex w-full flex-col lg:mt-0 lg:w-9/12">
            <div className="flex flex-col justify-between lg:flex-row lg:items-center">
              <div className="flex flex-row items-center">
                <p className="text-2xl font-bold">{organization.name}</p>
                <div className="ml-4 rounded-lg bg-purple-100/50 px-4 py-1 text-sm text-slate-800">
                  {formatEnumName(organization.type)}
                </div>
              </div>
              <div className="mt-2 flex flex-row items-center lg:mt-0">
                {organization.email && (
                  <a href={`mailto:${organization.email}`} className="mx-2">
                    <FaEnvelope className="h-7 w-7" color="darkgrey" />
                  </a>
                )}
                {organization.instagram && (
                  <a
                    href={organization.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2"
                  >
                    <FaInstagram className="h-7 w-7" color="darkgrey" />
                  </a>
                )}
                {organization.facebook && (
                  <a
                    href={organization.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2"
                  >
                    <FaFacebook className="h-7 w-7" color="darkgrey" />
                  </a>
                )}
                {organization.discord && (
                  <a
                    href={organization.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2"
                  >
                    <FaDiscord className="h-7 w-7" color="darkgrey" />
                  </a>
                )}
              </div>
            </div>
            <p
              className="ml-1 mt-4 flex items-center lg:mt-2"
              style={{
                fontSize: "1.01rem",
              }}
            >
              {organization?.university?.isLogoUploaded ? (
                <Image
                  src={organization?.university?.logo ?? ""}
                  alt="selected image"
                  width={25}
                  height={25}
                  style={{
                    objectFit: "cover",
                  }}
                  className="mr-2 rounded transition-opacity duration-500 group-hover:opacity-70"
                />
              ) : (
                <PiStudentFill className="mr-2" />
              )}
              {organization?.university?.name}
            </p>
            <p className="mt-6">{organization.description} </p>
            <div className="mt-8 flex flex-col justify-between md:flex-row lg:items-center">
              <div className="flex flex-row items-center">
                <AdminsDialog user={user} organization={organization} />
                <div className="mx-2">
                  <ShareButton textToCopy={organizationLink} />
                </div>
              </div>
              {isAdmin && (
                <div className="mt-4 flex flex-row items-center lg:mt-0">
                  <Link href={`/event/new`} className="mr-2">
                    <Button>
                      <PlusIcon color="white" className="mr-2 h-5 w-5" />
                      Create Event
                    </Button>
                  </Link>
                  <Link href={`/organization/${organization.id}/edit`}>
                    <Button>
                      <MdEdit color="white" className="mr-2 h-5 w-5" />
                      Edit
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <Separator className="mt-12" />
        {events?.length > 0 ? (
          <div className="mx-4 lg:mx-0">
            <h2 className="mt-8 text-2xl font-bold">Upcoming Events</h2>
            <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {events.map((event) => (
                <EventPreview key={event.id} event={event} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-48 flex flex-col items-center justify-center">
            <p className="mb-2">:(</p>
            No events planned for the moment!
          </div>
        )}
      </div>
    </div>
  );
}
