//has field
//unsure how to get specific org i want
//pretty sure everything else is good

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
import { PhotoIcon } from "@heroicons/react/24/outline";
import { MdEdit } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export default function OrgPage({
  params,
}: {
  params: { id: string };
}) {
  const [isLoading, setIsLoading] = useState(true);
  const { data: org, isLoading: isOrgLoading } =
    api.organizations.getCurrent.useQuery({id: params.id});
    
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
        university: org.university ?? "",
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
      window.location.href = '/organization/' + org.id;
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
        .from("images")
        .upload("organizations/" + orgImageId, data.image);

      const baseStorageUrl = env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;
      orgImage = baseStorageUrl + imageData?.path;
    }

    mutate({
      id: org.id,
      name: data.name,
      email: data.email,
      university: data.university,
      description: data.description,
      type: data.type,
      image: data.image ? orgImage: org?.image,
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
    <div className="flex w-screen justify-center p-8">
      <Card className="w-full max-w-2xl border border-border">
        <CardHeader>
          <CardTitle>Edit Organization Profile</CardTitle>
          <CardDescription>
            Please edit your organization's information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-1 flex-col justify-center gap-6 text-muted-foreground"
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor="image"
                      className="flex w-full flex-col items-center"
                    >
                      <div className="relative flex h-40 w-40 flex-col items-center justify-center bg-gray-50">
                        <span className="text-center font-semibold">
                          Change profile picture
                        </span>

                        {!field?.value ? (
                          !org?.image ? (
                            <PhotoIcon className="h-12 w-12" />
                          ) : (
                            <Image
                              src={org?.image || ""}
                              alt="selected image"
                              fill
                              style={{
                                objectFit: "cover",
                              }}
                              className="rounded-2xl"
                            />
                          )
                        ) : (
                          <Image
                            src={URL.createObjectURL(field.value)}
                            alt="selected image"
                            fill
                            style={{
                              objectFit: "cover",
                            }}
                            className="rounded-2xl"
                          />
                        )}
                      </div>
                      <div className="relative z-10 -mt-7 ml-12 h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-blue-300">
                        <MdEdit className="color-black ml-1 mt-1 h-5 w-5" />
                      </div>{" "}
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                  </>
                )}
              />

              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">Organization Name</FormLabel>
                      <FormControl>
                        <Input defaultValue={org.name} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">Organization Email</FormLabel>
                      <FormControl>
                        <Input defaultValue={org.email} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">University</FormLabel>
                      <FormControl>
                        <Input defaultValue={org.university} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Type of Organization</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={org.type} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BUSINESS">Business</SelectItem>
                          <SelectItem value="ENGINEERING">
                            Engineering
                          </SelectItem>
                          <SelectItem value="JOURNALISM">Journalism</SelectItem>
                          <SelectItem value="AGRICULTURE">
                            Agriculture
                          </SelectItem>
                          <SelectItem value="ART">Art</SelectItem>
                          <SelectItem value="DENTRISTRY">Dentistry</SelectItem>
                          <SelectItem value="DESIGN">Design</SelectItem>
                          <SelectItem value="CONSTRUCTION">
                            Construction
                          </SelectItem>
                          <SelectItem value="EDUCATION">Education</SelectItem>
                          <SelectItem value="LAW">Law</SelectItem>
                          <SelectItem value="SCIENCE">Science</SelectItem>
                          <SelectItem value="MEDICINE">Medicine</SelectItem>
                          <SelectItem value="NURSING">Nursing</SelectItem>
                          <SelectItem value="PHARMACY">Pharmacy</SelectItem>
                          <SelectItem value="VETERINARY">Veterinary</SelectItem>
                          <SelectItem value="PUBLIC_HEALTH">
                            Public Health
                          </SelectItem>
                          <SelectItem value="FARMING">Farming</SelectItem>
                          <SelectItem value="VOLUNEERING">
                            Volunteering
                          </SelectItem>
                          <SelectItem value="SPORTS">Sports</SelectItem>
                          <SelectItem value="E_SPORTS">E-Sports</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        defaultValue={org.description}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="Instagram"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">Instagram</FormLabel>
                      <FormControl>
                        <Input defaultValue={org.instagram} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Facebook"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">Facebook</FormLabel>
                      <FormControl>
                        <Input defaultValue={org.facebook} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Discord"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">Discord</FormLabel>
                      <FormControl>
                        <Input defaultValue={org.discord} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button variant="default" className="my-4 w-full" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
