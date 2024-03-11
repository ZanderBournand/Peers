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
import { PhotoIcon } from "@heroicons/react/24/outline";
import { MdEdit } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newUserSchema } from "@/lib/validators/User";
import { TrashIcon } from "@heroicons/react/24/outline";
import { api } from "@/trpc/react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/env";

export type NewUserInput = z.infer<typeof newUserSchema>;

export default function NewUserForm() {
  const [isLoading, setIsLoading] = useState(true);
  const { data: user, isLoading: isUserLoading } =
    api.users.getCurrent.useQuery();

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
      skills: [{ name: "" }],
      bio: "",
      github: "",
      linkedin: "",
      website: "",
    },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      form.reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        skills: user.skills?.map((skill) => ({ name: skill })) ?? [
          { name: "" },
        ],
        bio: user.bio ?? "",
        github: user.github ?? "",
        linkedin: user.linkedin ?? "",
        website: user.website ?? "",
      });
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [user, isUserLoading, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  const watchSkills = form.watch("skills");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const { mutate } = api.users.update.useMutation({
    onSuccess: () => {
      window.location.href = "/user";
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });

  const onSubmit = async (data: NewUserInputWithFile) => {
    const skillsList = data.skills.map((skill) => skill.name);

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
      image: userImage,
      firstName: capitalizeFirstLetter(data.firstName),
      lastName: capitalizeFirstLetter(data.lastName),
      skills: skillsList,
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
                        {!field?.value ? (
                          !user?.image ? (
                            <PhotoIcon className="h-12 w-12" />
                          ) : (
                            <Image
                              src={user?.image || ""}
                              alt="selected image"
                              fill
                              style={{
                                objectFit: "cover",
                              }}
                              className="rounded-full"
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
                            className="rounded-full"
                          />
                        )}
                      </div>
                      <div className="relative z-10 -mt-7 ml-12 h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-blue-300">
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
                name="skills"
                render={() => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {fields.map((field, index) => (
                        <div key={field.name}>
                          <div className="group relative flex items-center">
                            <FormControl>
                              <Input
                                placeholder="Your skill"
                                className="group-hover:pr-8"
                                {...form.register(
                                  `skills.${index}.name` as const,
                                )}
                              />
                            </FormControl>
                            {fields.length > 1 && (
                              <TrashIcon
                                className="invisible absolute right-1 h-6 w-6 text-muted-foreground/40 hover:cursor-pointer hover:text-muted-foreground/30 group-hover:visible"
                                onClick={() => remove(index)}
                              />
                            )}
                          </div>

                          {form.formState.errors.skills?.[index]?.name && (
                            <p className="text-sm font-medium text-destructive">
                              This can&apos;t be empty
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      disabled={watchSkills.some((field) => !field.name)}
                      onClick={() => append({ name: "" })}
                      className="max-w-min"
                    >
                      Add Skill
                    </Button>
                  </FormItem>
                )}
              />

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
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Github Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Your github username" {...field} />
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
                      <FormLabel>Linkedin Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your linkedin username"
                          {...field}
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
                      <Input placeholder="Your website url" {...field} />
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
