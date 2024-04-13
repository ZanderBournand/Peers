"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { type OrganizationData } from "@/lib/interfaces/organizationData";
import { MdPeople } from "react-icons/md";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { getDisplayName } from "@/lib/utils";
import Link from "next/link";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/trpc/react";
import { type UserData } from "@/lib/interfaces/userData";

interface AdminsDialogProps {
  user: UserData;
  organization: OrganizationData;
}

export default function AdminsDialog({
  user,
  organization,
}: AdminsDialogProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const addAdminMutation = api.organizations.addAdmin.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error adding admin:", errorMessage);
    },
  });

  const removeAdminMutation = api.organizations.removeAdmin.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error removing admin:", errorMessage);
    },
  });

  const isLoading = addAdminMutation.isLoading || removeAdminMutation.isLoading;
  const isAdmin = organization?.admins?.some((admin) => admin.id === user.id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MdPeople className="mr-2 h-5 w-5" /> Admins
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{organization.name}&apos;s admins</DialogTitle>
          <DialogDescription>
            Here are all the people that make this organization a reality!
          </DialogDescription>
        </DialogHeader>
        {isAdmin && (
          <div className="flex flex-row items-center justify-between">
            <Input
              type="email"
              placeholder="Email"
              className="w-3/4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => {
                addAdminMutation.mutate({
                  orgId: organization.id,
                  adminEmail: email,
                });
              }}
            >
              <PlusIcon className="mr-1 h-5 w-5" />
              Add
            </Button>
          </div>
        )}
        <Separator />
        <ScrollArea className="h-72 w-full pb-4">
          {isLoading ? (
            <div className="mt-24 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="h-5 w-5 animate-bounce rounded-full bg-gray-300/50 [animation-delay:-0.3s]" />
                <div className="h-5 w-5 animate-bounce rounded-full bg-gray-300/50 [animation-delay:-0.15s]" />
                <div className="h-5 w-5 animate-bounce rounded-full bg-gray-300/50" />
              </div>
            </div>
          ) : (
            organization?.admins?.map((admin) => (
              <div
                key={admin.id}
                className="flex flex-row items-center justify-between p-2"
              >
                <Link
                  href={`/user/${admin.id}`}
                  className="flex flex-row items-center"
                >
                  <Image
                    src={admin.image}
                    alt="admin image"
                    width={35}
                    height={35}
                    className="mr-1 rounded-full transition-opacity duration-500 group-hover:opacity-70"
                  />
                  <p className="ml-2">{getDisplayName(admin, true)}</p>
                  <Image
                    src={admin?.university?.logo ?? ""}
                    alt="selected image"
                    width={20}
                    height={20}
                    style={{
                      objectFit: "cover",
                    }}
                    className="ml-3 rounded transition-opacity duration-500 group-hover:opacity-70"
                  />
                </Link>
                {isAdmin && (
                  <Button
                    variant="link"
                    className="text-xs text-gray-800"
                    color="grey"
                    onClick={() => {
                      removeAdminMutation.mutate({
                        orgId: organization.id,
                        adminEmail: admin.email,
                      });
                    }}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                )}
              </div>
            ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
