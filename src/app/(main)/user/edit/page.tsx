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
import { Textarea } from "@/components/ui/textarea";
import { useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newUserSchema } from "@/lib/validators/newUser";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useEffect, useState } from "react";

export type NewUserInput = z.infer<typeof newUserSchema>;

export default function NewUserForm() {
  const [isLoading, setIsLoading] = useState(true);
  const { data: user, isLoading: isUserLoading } =
    api.users.getCurrent.useQuery();

  const form = useForm<NewUserInput>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
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

  const router = useRouter();

  const { mutate } = api.users.update.useMutation({
    onSuccess: () => {
      router.push("/user");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });

  const onSubmit = async (data: NewUserInput) => {
    const skillsList = data.skills.map((skill) => skill.name);
    mutate({
      firstName: capitalizeFirstLetter(data.firstName),
      lastName: capitalizeFirstLetter(data.lastName),
      skills: skillsList,
      bio: data.bio,
      github: data.github,
      linkedin: data.linkedin,
      website: data.website,
    });

    router.refresh();
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
