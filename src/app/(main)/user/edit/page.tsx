/*
  File -> Edit page for a user, allowing them to update their profile's info
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
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { MdEdit } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newUserSchema } from "@/lib/validators/User";
import { api } from "@/trpc/react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TagInput } from "@/components/tags/tag-input";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/env";
import { type TagData } from "@/lib/interfaces/tagData";

export type NewUserInput = z.infer<typeof newUserSchema>;

export default function NewUserForm() {
  const [isLoading, setIsLoading] = useState(true);

  const { data: user, isLoading: isUserLoading } = api.users.getUser.useQuery(
    {},
  );
  const { data: allTags } = api.tags.getAll.useQuery();

  type NewUserInputWithFile = Omit<NewUserInput, "image"> & {
    image: File | undefined;
  };

  const newUserSchemaWithFile = newUserSchema.omit({ image: true }).extend({
    image: z.instanceof(File).optional(),
  });

  const supabase = createClient();

  const form = useForm<NewUserInputWithFile>({
    resolver: zodResolver(newUserSchemaWithFile),
    defaultValues: {
      image: undefined,
      firstName: "",
      lastName: "",
      interests: [],
      bio: "",
      github: undefined,
      linkedin: undefined,
      website: undefined,
    },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      form.reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        interests: user.interests ?? [],
        bio: user.bio ?? "",
        github: user.github ?? undefined,
        linkedin: user.linkedin ?? undefined,
        website: user.website ?? undefined,
      });
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [user, isUserLoading, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const { mutate } = api.users.update.useMutation({
    onSuccess: () => {
      window.location.href = "/user/" + user?.id;
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });

  const onSubmit = async (data: NewUserInputWithFile) => {
    let userImage = null;
    if (data.image) {
      const userImageId: string = uuidv4();

      const { data: imageData } = await supabase.storage
        .from("images")
        .upload("users/" + userImageId, data.image);

      const baseStorageUrl = env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;
      userImage = baseStorageUrl + imageData?.path;
    }

    mutate({
      image: userImage ? userImage : user?.image ?? "",
      firstName: capitalizeFirstLetter(data.firstName),
      lastName: capitalizeFirstLetter(data.lastName),
      interests: data.interests,
      bio: data.bio,
      github: data.github,
      linkedin: data.linkedin,
      website: data.website,
    });
  };

  if (isLoading) {
    return (
      <div className="flex w-screen justify-center p-8">
        <Card className="w-full max-w-2xl border border-border">
          <CardHeader>
            <CardTitle>Loading User Profile...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex w-screen justify-center p-8">
      <Card className="w-full max-w-2xl border border-border">
        <CardHeader>
          <CardTitle>Edit User Profile</CardTitle>
          <CardDescription>Please enter your information below</CardDescription>
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
                      <div
                        className="relative -mt-2 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 bg-gray-50"
                        title="Change profile picture"
                      >
                        <Image
                          src={
                            field.value
                              ? URL.createObjectURL(field.value)
                              : user?.image ?? ""
                          }
                          alt="selected image"
                          fill
                          style={{
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                      <div className="relative z-10 -mt-7 ml-12 h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-violet-600">
                        <MdEdit color="white" className="ml-1 mt-1 h-5 w-5" />
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
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">First name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your first name" {...field} />
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
                      <FormLabel className="">Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem className="mt-4 w-full">
                    <FormLabel className="">Interests</FormLabel>
                    <FormControl>
                      <TagInput
                        {...field}
                        placeholder="Enter a topic"
                        tags={field.value}
                        className="w-full"
                        setTags={(newInterests) => {
                          form.setValue(
                            "interests",
                            newInterests as [TagData, ...TagData[]],
                          );
                        }}
                        enableAutocomplete
                        autocompleteOptions={allTags}
                        enableStrictAutocomplete={true}
                        value={field.value ?? []}
                        variant="custom"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Github</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your github link"
                          {...field}
                          value={field.value ?? undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Linkedin</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your linkedin link"
                          {...field}
                          value={field.value ?? undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your website url"
                        {...field}
                        value={field.value ?? undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
