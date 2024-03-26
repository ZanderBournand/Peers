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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newOrgSchema } from "@/lib/validators/Organization";
import { useRouter } from "next/navigation";
import { PhotoIcon } from "@heroicons/react/24/outline";
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
      description: undefined,
      image: undefined,
      type: undefined,
      instagram: undefined,
      discord: undefined,
      facebook: undefined,
    },
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
      description: data.description,
      type: data.type,
      instagram: undefined,
      discord: undefined,
      facebook: undefined,
      //image?
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
              </div>

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
                            <SelectValue placeholder="Select the type of organization" />
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
                        placeholder="Tell us about the organization"
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
                  name="OrgName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">Instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="Instagram" {...field} />
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
                      <FormLabel className="">Facebook</FormLabel>
                      <FormControl>
                        <Input placeholder="Facebook" {...field} />
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
                      <FormLabel className="">Discord</FormLabel>
                      <FormControl>
                        <Input placeholder="Discord" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <>
                    <Label
                      htmlFor="image"
                      className="my-4 flex w-full flex-col items-center"
                    >
                      <div className="relative flex h-60 w-60 flex-col items-center justify-center rounded-2xl bg-gray-50">
                        {!field?.value ? (
                          <>
                            <PhotoIcon className="h-10 w-10" color="darkgray" />
                            <span className="text-center font-semibold">
                              Click to add your organization's profile image
                            </span>
                            <span className="text-xs">
                              JPEG or PNG, no larger than 10 MB
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

              <div className="flex justify-center">
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
