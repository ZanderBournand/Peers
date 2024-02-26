"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
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
import { useForm, useWatch, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newOrgSchema } from "@/lib/validators/newOrganization";
import { useRouter } from "next/navigation";
import { DateTimePicker } from "@/components/ui/datetimepicker";
import { PhotoIcon } from "@heroicons/react/24/outline";
import InputMask from "react-input-mask";
import { createClient } from "@/utils/supabase/client";
import { api } from "@/trpc/react";
import { v4 as uuidv4 } from "uuid";
import { ReloadIcon } from "@radix-ui/react-icons";
import { env } from "@/env";

export type NewOrgInput = z.infer<typeof newOrgSchema>;

export default function CreateOrganization() {
  const [isOrgization, setIsOrgization] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control } = useForm();
  const supabase = createClient();

  const { data: user } = api.users.getCurrent.useQuery();

  // Overriding existing schemas to include file input for image ("File" type is translated into "string" on submit)
  type NewOrgInputWithFile = Omit<NewOrgInput, "image"> & {
    image: File | undefined;
  };
  const newOrgSchemaWithFile = newOrgSchema.omit({ image: true }).extend({
    image: z.instanceof(File).optional(),
  });

  const form = useForm<NewOrgInputWithFile>({
    resolver: zodResolver(newOrgSchemaWithFile),
    defaultValues: {
      name: undefined,
      email: undefined,
      president: undefined,
      description: undefined,
    },
  });

  const typeValue = useWatch({
    control: form.control,
    name: "type",
    defaultValue: undefined,
  });

  const router = useRouter();

  const { mutate } = api.organizations.create.useMutation({
    onSuccess: () => {
      router.push("/");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating organization:", errorMessage);
    },
  });

  const onSubmit = async (data: NewOrgInputWithFile) => {
    setIsSubmitting(true);
    const newOrgData: NewOrgInput = {
      name: data.name,
      email: data.email,
      president: data.president,
      description: data.description,
    };

    mutate(newOrgData);
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
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="OrgName"
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
                  name="OrgEmail"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="OrgPresident"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">Organization President</FormLabel>
                      <FormControl>
                        <Input placeholder="First and Last Name" {...field} />
                      </FormControl>
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
                        placeholder="Tell us about the Organization"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                <Button 
                  variant="destructive"
                  className="my-4 w-1/2 justify-center"

                  type="button"
                  >
                    Cancel</Button>
              
                <Button
                  variant="default"
                  className="my-4 w-1/2 justify-center"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
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
