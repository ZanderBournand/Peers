"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { MdEdit } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ShareButton from "@/components/events/ShareButton";
import { headers } from "next/headers";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newOrgSchema } from "@/lib/validators/Organization";
import { TrashIcon } from "@heroicons/react/24/outline";
import { api } from "@/trpc/react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/env";
import { OrganizationData } from "@/lib/interfaces/organizationData";
import { appRouter } from "@/server/api/root";

export type NewOrgInput = z.infer<typeof newOrgSchema>;

export default function OrgPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const { data: org, isLoading: isOrgLoading } =
    api.organizations.getCurrent.useQuery({ id: params.id });

  type NewOrgInputWithFile = Omit<NewOrgInput, "image"> & {
    image: File | undefined;
  };

  const newOrgSchemaWithFile = newOrgSchema.omit({ image: true }).extend({
    image: z.instanceof(File).optional(),
  });

  const supabase = createClient();

  const form = useForm<NewOrgInputWithFile>({
    resolver: zodResolver(newOrgSchemaWithFile),
    defaultValues: {
      name: undefined,
      email: undefined,
      university: undefined,
      description: undefined,
      image: undefined,
      type: undefined,
      instagram: undefined,
      facebook: undefined,
      discord: undefined,
    },
  });

  useEffect(() => {
    if (!isOrgLoading && org) {
      form.reset({
        name: org.name ?? "",
        email: org.email ?? "",
        type: org.type ?? "",
        description: org.description ?? "",
        instagram: org.instagram ?? "",
        facebook: org.facebook ?? "",
        discord: org.discord ?? "",
      });
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [org, isOrgLoading, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const { mutate } = api.organizations.update.useMutation({
    onSuccess: () => {
      window.location.href = "/organization/view/${id}";
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });

  const onSubmit = async (data: NewOrgInputWithFile) => {
    let orgImage = null;
    if (data.image) {
      const orgImageId: string = uuidv4();

      const { data: imageData } = await supabase.storage
        .from("organizations")
        .upload("organizations/" + orgImageId, data.image);

      const baseStorageUrl = env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;
      orgImage = baseStorageUrl + imageData?.path;
    }

    mutate({
      name: data.name,
      email: data.email,
      university: data.university,
      description: data.description,
      type: data.type,
      image: data.image,
      instagram: data.instagram,
      facebook: data.facebook,
      discord: data.discord,
    });
  };

  if (isLoading) {
    return (
      <div className="flex w-screen justify-center p-8">
        <Card className="w-full max-w-2xl border border-border">
          <CardHeader>
            <CardTitle>Loading Organization Profile...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center pb-32">
      <div className="my-16 flex w-full max-w-screen-xl flex-row justify-center self-center pb-6">
        <div className="flex w-8/12 flex-col items-start px-20 pb-6">
          <div className="relative flex aspect-video w-full items-center justify-center bg-gray-50">
            {org.image ? (
              <Image
                src={org.image}
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
            <CardTitle style={{ fontSize: "34px" }}>
              {org.name} @ {org.university}
            </CardTitle>
          </div>
          <div className="inline-block">
            <div style={{fontSize: "22px" }} className="block inline flex items-center justify-center rounded-lg bg-orange-100/50 px-2 py-1 text-sm text-slate-800">
              {org.email}
            </div>
          </div>

          <div
            style={{ paddingTop: "30px" }}
            className="flex items-center justify-center"
          >
            <CardTitle>Club Description:</CardTitle>
          </div>
          <div className="flex items-center justify-center pb-6">
            {org.description}
          </div>
          <CardTitle>Club Leader(s):</CardTitle>
          <div className="flex items-center justify-center pb-6">
            ADD ADMIN NAME(S) HERE
          </div>

          <CardTitle className="pb-2">Type of Organization:</CardTitle>
          <div className="rounded-lg bg-purple-100/50 px-4 py-1 text-sm text-slate-800">
            {org.type}
          </div>

          <div style={{ paddingTop: "30px" }} className="flex flex-row gap-8">
            <div className="flex flex-col">
              <CardTitle>Instagram:</CardTitle>
              <div className="flex items-center justify-center rounded-lg bg-blue-100/50 px-4 py-1 text-sm text-slate-800">
                {org.instagram}
              </div>
            </div>

            <div className="flex flex-col">
              <CardTitle>Facebook:</CardTitle>
              <div className="flex items-center justify-center rounded-lg bg-green-100/50 px-4 py-1 text-sm text-slate-800">
                {org.facebook}
              </div>
            </div>

            <div className="flex flex-col">
              <CardTitle>Discord:</CardTitle>
              <div className="flex items-center justify-center rounded-lg bg-red-100/50 px-4 py-1 text-sm text-slate-800">
                {org.discord}
              </div>
            </div>
          </div>

          <div style={{ paddingTop: "30px", textAlign: "center" }}>
            <div>IF IS AN ADMIN</div>
            <Link href={`/organization/edit/${org.id}`}>
              <Button
                className="items-center justify-center"
                style={{ padding: "20px 40px", fontSize: "24px" }}
              >
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
