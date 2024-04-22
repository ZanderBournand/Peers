/*
  File -> Edit page for an event, allowing the user to update the event details
*/

"use client";

import { useEffect, useState } from "react";
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
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newEventSchema } from "@/lib/validators/Event";
import { useRouter } from "next/navigation";
import { DateTimePicker } from "@/components/ui/datetimepicker";
import {
  PhotoIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  LinkIcon,
  MapPinIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import InputMask from "react-input-mask";
import { createClient } from "@/utils/supabase/client";
import { api } from "@/trpc/react";
import { v4 as uuidv4 } from "uuid";
import { ReloadIcon } from "@radix-ui/react-icons";
import { env } from "@/env";
import MapsButton from "@/components/location/MapsButton";
import LocationInput from "@/components/location/LocationInput";
import { TagInput } from "@/components/tags/tag-input";
import { type TagData } from "@/lib/interfaces/tagData";
import DefaultImagesButton from "@/components/events/DefaultImages";
import { redirect } from "next/navigation";

export type NewEventInput = z.infer<typeof newEventSchema>;

export default function EditEvent({ params }: { params: { id: string } }) {
  const [isOrgEvent, setIsOrgEvent] = useState(false);
  const [orgSelected, setOrgSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needLocationDetails, setNeedLocationDetails] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const { data: user } = api.users.getUser.useQuery({});
  const { data: allTags } = api.tags.getAll.useQuery();
  const { data: userOrganizations } = api.organizations.getAdminOrgs.useQuery({
    userId: user?.id ?? "",
  });

  const { data: event, isLoading: isEventLoading } = api.events.get.useQuery({
    id: params.id,
  });

  if (event && user) {
    const isHost =
      event?.orgHost?.admins?.some((admin) => admin.id === user?.id) ??
      event?.userHost?.id === user?.id;

    if (!isHost) {
      redirect(`/event/${params.id}`);
    }
  }

  const form = useForm<NewEventInput>({
    resolver: zodResolver(newEventSchema),
    defaultValues: {
      title: undefined,
      location: undefined,
      locationDetails: undefined,
      date: undefined,
      description: undefined,
      image: undefined,
      type: undefined,
      duration: undefined,
      tags: [],
    },
  });

  const typeValue = useWatch({
    control: form.control,
    name: "type",
    defaultValue: undefined,
  });

  useEffect(() => {
    if (!isEventLoading && event) {
      form.reset({
        title: event.title ?? "",
        date: event.date ?? "",
        description: event.description ?? "",
        image: event.image ?? "",
        type: event.type ?? "",
        duration: event.duration ?? 0,
        tags: event.tags ?? [],
      });
      if (event.type === "IN_PERSON") {
        form.setValue("location", event.location ?? "");
        if (event.locationDetails !== null) {
          setNeedLocationDetails(true);
          form.setValue("locationDetails", event.locationDetails ?? "");
        }
      }
      if (event.orgHostId !== null) {
        setIsOrgEvent(true);
        setOrgSelected(event.orgHostId);
      }
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [event, isEventLoading, form]);

  const router = useRouter();

  const { mutate } = api.events.update.useMutation({
    onSuccess: () => {
      window.location.href = `/event/${params.id}`;
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error updating event:", errorMessage);
    },
  });

  const onSubmit = async (data: NewEventInput) => {
    setIsSubmitting(true);

    const updatedEventData: NewEventInput = {
      title: data.title,
      date: data.date,
      description: data.description,
      type: data.type,
      duration: data.duration,
      tags: data.tags,
      location: data.location,
      locationDetails: data.locationDetails,
      image: data.image,
    };

    // Image file was uploaded
    if (imageFile) {
      const eventImageId: string = uuidv4();

      const { data: imageData } = await supabase.storage
        .from("images")
        .upload("events/" + eventImageId, imageFile);

      updatedEventData.image =
        env.NEXT_PUBLIC_SUPABASE_STORAGE_URL + imageData?.path;
    }

    if (isOrgEvent) {
      updatedEventData.orgHostId = orgSelected;
      updatedEventData.userHostId = null;
    } else {
      updatedEventData.userHostId = user?.id;
      updatedEventData.orgHostId = null;
    }

    mutate({ ...updatedEventData, id: params.id });
    setIsSubmitting(false);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", URL.createObjectURL(file));

      setImageFile(file);
    }
  };

  const handleDefaultImageChange = (defaultImage: string) => {
    form.setValue("image", defaultImage);
    setImageFile(null);
  };

  const handleImageRemoval = () => {
    form.resetField("image");
    setImageFile(null);
  };

  const handleLocationChange = (location: string) => {
    if (location) {
      form.setValue("location", location);
    }
  };

  const handleLocationDetailsChange = (locationDetails: string | null) => {
    if (locationDetails) {
      setNeedLocationDetails(true);
    }
    form.setValue("locationDetails", locationDetails);
  };

  return isLoading ? (
    <div className="mt-96 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center space-x-2">
        <div className="h-5 w-5 animate-bounce rounded-full bg-gray-300/50 [animation-delay:-0.3s]" />
        <div className="h-5 w-5 animate-bounce rounded-full bg-gray-300/50 [animation-delay:-0.15s]" />
        <div className="h-5 w-5 animate-bounce rounded-full bg-gray-300/50" />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center px-8 pb-32">
      <div className="mt-12 flex w-full max-w-screen-xl flex-col self-center">
        <h1 className="text-3xl font-bold">Update your Event</h1>
        <h3 className="text-gray-600">
          Need to make some changes to an upcoming event? Do it right here!
        </h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex flex-col justify-between gap-6 text-muted-foreground lg:flex-row"
          >
            <div className="flex-start mt-4 flex w-full max-w-screen-md flex-col">
              <div className="flex flex-row gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-7/12">
                      <FormLabel className="">Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title of the event" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="w-5/12 min-w-[250px]">
                      <FormLabel>Type of event</FormLabel>
                      <div className="flex flex-row items-center">
                        <div
                          className={`mr-4 flex cursor-pointer flex-col items-center ${
                            field.value === "IN_PERSON" && "text-green-800"
                          } hover:text-green-800`}
                          onClick={() => field.onChange("IN_PERSON")}
                        >
                          <Button
                            variant="outline"
                            type="button"
                            className={`flex h-14 w-14  items-center justify-center ${
                              field.value === "IN_PERSON" &&
                              "bg-green-200/30 shadow-md"
                            } hover:bg-green-200/30 hover:text-green-800 hover:shadow-md`}
                          >
                            <MapPinIcon className="h-7 w-7 flex-shrink-0" />
                          </Button>
                          <p className="mt-1">In-person</p>
                        </div>

                        <div
                          className={`mr-6 flex cursor-pointer flex-col items-center ${
                            field.value === "ONLINE_VIDEO" && "text-cyan-800"
                          } hover:text-cyan-800`}
                          onClick={() => field.onChange("ONLINE_VIDEO")}
                        >
                          <Button
                            variant="outline"
                            type="button"
                            className={`flex h-14 w-14  items-center justify-center ${
                              field.value === "ONLINE_VIDEO" &&
                              "bg-blue-200/30 shadow-md"
                            } hover:bg-blue-200/30 hover:text-cyan-800 hover:shadow-md`}
                          >
                            <VideoCameraIcon className="h-7 w-7 flex-shrink-0" />
                          </Button>
                          <p className="mt-1">Video</p>
                        </div>
                        <div
                          className={`flex cursor-pointer flex-col items-center ${
                            field.value === "ONLINE_AUDIO" && "text-purple-800"
                          } hover:text-purple-800`}
                          onClick={() => field.onChange("ONLINE_AUDIO")}
                        >
                          <Button
                            variant="outline"
                            type="button"
                            className={`flex h-14 w-14  items-center justify-center ${
                              field.value === "ONLINE_AUDIO" &&
                              "bg-purple-300/30 shadow-md"
                            } hover:bg-purple-300/30 hover:text-purple-800 hover:shadow-md`}
                          >
                            <MicrophoneIcon className="h-7 w-7 flex-shrink-0" />
                          </Button>
                          <p className="mt-1">Audio</p>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about the event"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {typeValue === "IN_PERSON" && (
                <div className="flex-start mt-12 flex flex-col rounded-lg bg-gray-50/50 px-2 py-3">
                  <div className="flex flex-row items-center">
                    <p className="text-xl font-semibold text-black">Location</p>
                    <div className="my-2 ml-3 flex w-max flex-row items-center rounded-md bg-green-200 bg-opacity-30 px-2 py-1 text-sm text-green-800">
                      <MapPinIcon className="mr-1 h-5 w-5" />
                      {"In-person"}
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <div className="flex flex-row items-center">
                            <div className="flex w-2/3 flex-col">
                              <LocationInput
                                location={field.value}
                                setLocation={handleLocationChange}
                              />
                            </div>
                            <div className="flex w-1/4">
                              <MapsButton
                                location={form.watch("location")}
                                locationDetails={form.watch("locationDetails")}
                                setLocation={handleLocationChange}
                                setLocationDetails={handleLocationDetailsChange}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-6 flex flex-col gap-4">
                    <div className="ml-1 flex w-full flex-row items-center">
                      <Checkbox
                        checked={needLocationDetails}
                        onCheckedChange={(checked: boolean) =>
                          setNeedLocationDetails(checked)
                        }
                        className="h-5 w-5"
                      />
                      <FormLabel className="ml-3">
                        Any location specific details (e.g. room number, floor,
                        etc.)?
                      </FormLabel>
                    </div>
                    {needLocationDetails && (
                      <FormField
                        control={form.control}
                        name="locationDetails"
                        render={({ field }) => (
                          <FormItem className="ml-1 w-2/3">
                            <FormControl>
                              <Input
                                placeholder="Location details..."
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              )}
              <div className="flex-start mt-12 flex flex-col">
                <p className="text-xl font-semibold text-black">Date & time</p>
                <div className="mt-4 flex flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Date of event</FormLabel>
                        <DateTimePicker
                          date={field.value}
                          setDate={(date) => field.onChange(date)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({}) => (
                      <FormItem className="mx-4 w-3/5">
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Controller
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                              <InputMask
                                mask="9 h : 99 mins"
                                placeholder="Enter a duration"
                                value={
                                  field.value !== undefined
                                    ? `${Math.floor(field.value / 60)} h : ${(
                                        field.value % 60
                                      )
                                        .toString()
                                        .padStart(2, "0")} mins`
                                    : ""
                                }
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                  const [hours, minutes] =
                                    e.target?.value.split(" : ");
                                  if (parseInt(minutes ?? "") > 59) {
                                    e.target.value = hours + " : 59 mins";
                                  }
                                  const parsedHours = isNaN(
                                    parseInt(hours ?? ""),
                                  )
                                    ? 0
                                    : parseInt(hours ?? "");
                                  const parsedMinutes = isNaN(
                                    parseInt(minutes ?? ""),
                                  )
                                    ? 0
                                    : parseInt(minutes ?? "");
                                  const totalMinutes =
                                    parsedHours * 60 + parsedMinutes;
                                  field.onChange(totalMinutes);
                                }}
                              >
                                <Input />
                              </InputMask>
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex-start mt-12 flex flex-col">
                <p className="text-xl font-semibold text-black">Extras</p>
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="mt-4 w-full">
                      <FormLabel className="">Tags</FormLabel>
                      <FormControl>
                        <TagInput
                          {...field}
                          placeholder="Enter a topic"
                          tags={field.value ?? []}
                          className="w-full"
                          setTags={(newTags) => {
                            form.setValue(
                              "tags",
                              newTags as [TagData, ...TagData[]],
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
              </div>
            </div>
            <div className="flex-start flex w-full flex-col">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="my-4 flex w-full flex-col items-center">
                        {field.value && (
                          <div className="flex-start flex w-3/4 flex-row items-center">
                            {imageFile && (
                              <div className="ml-1 mr-2 flex flex-row items-center">
                                <LinkIcon className="h-5 w-5" color="#6b21a8" />
                                <p className="ml-2 text-sm text-purple-800">
                                  {imageFile?.name}
                                </p>
                                <p className="ml-4 text-xl text-gray-200">|</p>
                              </div>
                            )}
                            <div className="flex flex-row items-center">
                              <Button type="button" variant="ghost">
                                <Label
                                  htmlFor="image"
                                  className="flex cursor-pointer flex-row items-center"
                                >
                                  <PencilIcon className="mr-2 h-5 w-5" />
                                  <p>Edit</p>
                                </Label>
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={handleImageRemoval}
                                className=""
                              >
                                <TrashIcon className="mr-1 h-5 w-5" />
                                <p>Remove</p>
                              </Button>
                            </div>
                          </div>
                        )}
                        <Label
                          htmlFor="image"
                          className="flex w-full flex-col items-center"
                        >
                          <div
                            className={`relative flex aspect-video w-3/4 cursor-pointer flex-col items-center justify-center rounded-2xl bg-gray-50/50 ${
                              !field.value &&
                              "border-2 border-dashed border-gray-200"
                            }`}
                          >
                            {!field.value ? (
                              <>
                                <PhotoIcon
                                  className="h-10 w-10"
                                  color="darkgray"
                                />
                                <span className="text-lg font-semibold">
                                  Click to add an event image
                                </span>
                                <span className="text-xs">
                                  JPEG or PNG, no larger than 10 MB
                                </span>
                              </>
                            ) : (
                              <Image
                                src={field.value}
                                alt="selected image"
                                fill
                                sizes="100%"
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
                          accept=".jpeg,.jpg,.png"
                          style={{ display: "none" }}
                          onChange={handleImageFileChange}
                        />
                        <FormMessage className="mt-4 w-3/4" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex w-3/4 flex-col items-center self-center pl-2">
                <DefaultImagesButton onImageChange={handleDefaultImageChange} />
                <div className="mt-8 flex w-full flex-col justify-start">
                  <div className="ml-1 flex flex-row items-center">
                    <Checkbox
                      checked={isOrgEvent}
                      onCheckedChange={(checked: boolean) =>
                        setIsOrgEvent(checked)
                      }
                      className="h-5 w-5"
                    />
                    <FormLabel className="ml-3">
                      Is this event hosted by an organization?
                    </FormLabel>
                  </div>
                  {isOrgEvent && (
                    <FormItem className="mt-4 w-1/2">
                      <FormLabel>Host Organization</FormLabel>
                      <Select
                        value={orgSelected ?? undefined}
                        onValueChange={(value) => setOrgSelected(value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the host organization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userOrganizations?.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              <div className="flex flex-row items-center">
                                <Image
                                  src={org.image}
                                  alt="admin image"
                                  width={30}
                                  height={30}
                                  className="mr-1 rounded-sm transition-opacity duration-500 group-hover:opacity-70"
                                />
                                <p className="ml-2">{org.name}</p>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                </div>
              </div>
              <div className="mt-6 flex flex-row justify-center">
                <Button
                  variant="outline"
                  className="mx-4 my-4 w-1/3 justify-center"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => router.push(`/event/${params.id}`)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="mx-4 my-4 w-1/3 justify-center"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
