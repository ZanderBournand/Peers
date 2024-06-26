/*
  File -> Form page to create a new organization
  - Fiels include organization name, type, description, email, socials (optional), and image
*/

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newOrgSchema } from "@/lib/validators/Organization";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase/client";
import { api } from "@/trpc/react";
import { v4 as uuidv4 } from "uuid";
import { ReloadIcon } from "@radix-ui/react-icons";
import { env } from "@/env";
import { OrganizationType } from "@prisma/client";
import { formatEnumName } from "@/lib/utils";

export type NewOrgInput = z.infer<typeof newOrgSchema>;

export default function CreateOrganization() {
  const supabase = createClient();

  // Overriding existing schemas to include file input for image ("File" type is translated into "string" on submit)
  type NewOrgInputWithFile = Omit<NewOrgInput, "image"> & {
    image: File | undefined;
  };
  const orgSchemaInputFields = newOrgSchema
    .omit({ image: true, university: true })
    .extend({
      image: z.instanceof(File).optional(),
    });

  const { data: user } = api.users.getUser.useQuery({});

  const form = useForm<NewOrgInputWithFile>({
    resolver: zodResolver(orgSchemaInputFields),
    defaultValues: {
      name: undefined,
      email: undefined,
      type: undefined,
      description: undefined,
      image: undefined,
      instagram: undefined,
      discord: undefined,
      facebook: undefined,
    },
  });

  const { mutate, isLoading: isCreateLoading } =
    api.organizations.create.useMutation({
      onSuccess: (data) => {
        window.location.href = `/organization/${data?.id}`;
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        console.error("Error creating organization:", errorMessage);
      },
    });

  const onSubmit = async (data: NewOrgInputWithFile) => {
    const newOrgData: NewOrgInput = {
      name: data.name,
      email: data.email,
      university: user?.universityName ?? "",
      type: data.type,
      image:
        "https://erwggivaefiaiqdqgtqb.supabase.co/storage/v1/object/public/images/organizations/default",
      description: data.description,
      instagram: data.instagram,
      discord: data.discord,
      facebook: data.facebook,
    };

    if (data.image) {
      const orgImageId: string = uuidv4();

      const { data: imageData } = await supabase.storage
        .from("images")
        .upload("organizations/" + orgImageId, data.image);

      const baseStorageUrl = env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;
      newOrgData.image = baseStorageUrl + imageData?.path;
    }

    mutate(newOrgData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  return (
    <div className="flex w-screen justify-center p-8">
      <Card className="w-full max-w-2xl border border-border">
        <CardHeader>
          <CardTitle>Create Organization</CardTitle>
          <CardDescription>
            Create an organzation to list your events and gain exposure!
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
                      className="mt-2 flex w-full flex-col items-center"
                    >
                      <div className="relative flex h-48 w-48 cursor-pointer flex-col items-center justify-center rounded-2xl bg-gray-50">
                        {!field?.value ? (
                          <>
                            <PhotoIcon className="h-10 w-10" color="darkgray" />
                            <span className="mt-2 px-4 text-center text-xs font-semibold">
                              Add your organization&apos;s profile image
                            </span>
                          </>
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
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                            <SelectValue placeholder="Select the type of organization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(OrganizationType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {formatEnumName(type)}
                            </SelectItem>
                          ))}
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
                        placeholder="Tell us about the organization"
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="mt-2 text-lg font-semibold text-black">
                Socials{" "}
                <span className="text-sm text-gray-600">(optional)</span>
              </p>
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">Instagram</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Instagram"
                          value={field?.value ?? undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">Facebook</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Facebook"
                          value={field?.value ?? undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discord"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">Discord</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Discord"
                          value={field?.value ?? undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-center">
                <Button
                  variant="default"
                  className="my-4 w-1/2 justify-center"
                  type="submit"
                  disabled={isCreateLoading}
                >
                  {isCreateLoading && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
