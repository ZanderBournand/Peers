import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import Image from "next/image";
import ShareButton from "@/components/organizations/ShareButton";
import Link from "next/link";
import { type z } from "zod";
import { type newOrgSchema } from "@/lib/validators/Organization";
import { api } from "@/trpc/server";
import { type OrganizationData } from "@/lib/interfaces/organizationData";

export type NewOrgInput = z.infer<typeof newOrgSchema>;

export default async function OrgPage({ params }: { params: { id: string } }) {
  const organization: OrganizationData =
    await api.organizations.getOrganization.query({
      id: params.id,
    });

  return (
    <div className="flex items-center justify-center pb-32">
      <div className="my-16 flex w-full max-w-screen-xl flex-row justify-center self-center pb-7">
        <div className="flex w-8/12 flex-col items-start px-20 pb-7">
          <div className="relative flex aspect-video w-full items-center justify-center bg-gray-50">
            {organization.image ? (
              <Image
                src={organization.image}
                alt="selected image"
                fill
                style={{
                  objectFit: "cover",
                }}
                className="rounded-lg transition-opacity duration-500 group-hover:opacity-70"
              />
            ) : (
              <div className="flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
          </div>
          <div className="flex items-center justify-center pb-2">
            <CardTitle style={{ fontSize: "34px", paddingTop: "30px" }}>
              {organization.name} @ {organization?.university?.name}
            </CardTitle>
          </div>
          <div className="inline-block">
            <div
              style={{ fontSize: "22px" }}
              className="block inline flex items-center justify-center rounded-lg bg-orange-100/50 px-2 py-1 text-sm text-slate-800"
            >
              {organization.email}
            </div>
          </div>

          <div
            style={{ paddingTop: "30px" }}
            className="flex items-center justify-center"
          >
            <CardTitle>Club Description:</CardTitle>
          </div>
          <div className="flex items-center justify-center pb-7">
            {organization.description}
          </div>
          <CardTitle>Club Leader(s):</CardTitle>
          <div className="flex items-center justify-center pb-7">
            ADD ADMIN NAME(S) HERE
          </div>

          <CardTitle className="pb-2">Type of Organization:</CardTitle>
          <div className="rounded-lg bg-purple-100/50 px-4 py-1 text-sm text-slate-800">
            {organization.type}
          </div>

          <div style={{ paddingTop: "30px" }} className="flex flex-row gap-8">
            <div className="flex flex-col">
              <CardTitle>Instagram:</CardTitle>
              <div className="flex items-center justify-center rounded-lg bg-blue-100/50 px-4 py-1 text-sm text-slate-800">
                {organization.instagram}
              </div>
            </div>

            <div className="flex flex-col">
              <CardTitle>Facebook:</CardTitle>
              <div className="flex items-center justify-center rounded-lg bg-green-100/50 px-4 py-1 text-sm text-slate-800">
                {organization.facebook}
              </div>
            </div>

            <div className="flex flex-col">
              <CardTitle>Discord:</CardTitle>
              <div className="flex items-center justify-center rounded-lg bg-red-100/50 px-4 py-1 text-sm text-slate-800">
                {organization.discord}
              </div>
            </div>
          </div>

          <div style={{ paddingTop: "30px", textAlign: "center" }}>
            <Link href={`/organization/${organization.id}/edit`}>
              <Button
                className="items-center justify-center"
                style={{ padding: "20px 40px", fontSize: "24px" }}
              >
                Edit
              </Button>
            </Link>
          </div>
        </div>
        <ShareButton
          textToCopy={"http://localhost:3000/organization/" + organization.id}
        />
      </div>
    </div>
  );
}
