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
import { Textarea } from "@/components/ui/textarea";
import { useForm, useWatch, Controller } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newEventSchema } from "@/lib/validators/newEvent";
import { useRouter } from "next/navigation";
import { DateTimePicker } from "@/components/ui/datetimepicker";
import InputMask from "react-input-mask";
import { api } from "@/trpc/react";

export type NewEventInput = z.infer<typeof newEventSchema>;

export default function CreateEvent() {
  const [isOrgEvent, setIsOrgEvent] = useState(false);
  const { control, setValue } = useForm();

  const form = useForm<NewEventInput>({
    resolver: zodResolver(newEventSchema),
    defaultValues: {
      title: undefined,
      location: undefined,
      date: undefined,
      description: undefined,
      image: undefined,
      type: undefined,
      duration: undefined,
    },
  });

  const handleCheckboxChange = (checked: boolean) => {
    setIsOrgEvent(checked);
    if (!checked) {
      // NOTE: "organization" field value is not handled ATM
      // -> waiting on implementation of organization creation
      setValue("organization", undefined);
    }
  };

  const typeValue = useWatch({
    control: form.control,
    name: "type",
    defaultValue: undefined,
  });

  const router = useRouter();

  const { mutate } = api.events.create.useMutation({
    onSuccess: () => {
      router.push("/");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating event:", errorMessage);
    },
  });

  const onSubmit = async (data: NewEventInput) => {
    console.log("SUBMITTING FORN DATA:", data);
    const newEventData: NewEventInput = {
      title: data.title,
      date: data.date,
      description: data.description,
      type: data.type,
      duration: data.duration,
    };

    if (data.location) {
      newEventData.location = data.location;
    }
    if (data.image) {
      newEventData.image = data.image;
    }

    mutate(newEventData);
  };

  return (
    <div className="flex w-screen justify-center p-8">
      <Card className="w-full max-w-2xl border border-border">
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
          <CardDescription>
            Have an idea for an upcoming event? Bring it to life right here!
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
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
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
                    <FormItem className="w-full">
                      <FormLabel>Type of event</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the type of event" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ONLINE">Online</SelectItem>
                          <SelectItem value="IN_PERSON">In-person</SelectItem>
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
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="The location of your event (e.g., campus room, coffee shop, etc.)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="flex flex-row gap-4">
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
                                const parsedHours = isNaN(parseInt(hours ?? ""))
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
              <div className="flex flex-col gap-4">
                <div className="ml-1 mt-4 flex w-full flex-row items-center">
                  <Checkbox
                    checked={isOrgEvent}
                    onCheckedChange={handleCheckboxChange}
                    className="h-5 w-5"
                    // disabled
                  />
                  <FormLabel className="ml-3">
                    Is this event hosted by an organization?
                  </FormLabel>
                </div>
                {isOrgEvent && (
                  <FormField
                    control={control}
                    // NOTE: "organization" field value is not handled ATM
                    // -> waiting on implementation of organization creation
                    name="organization"
                    render={({ field }) => (
                      <FormItem className="ml-1 w-1/2">
                        <FormLabel>Host Organization</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value as string}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the host organization" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ORG 1">
                              ORGANIZATION 1
                            </SelectItem>
                            <SelectItem value="ORG 2">
                              ORGANIZATION 2
                            </SelectItem>
                            <SelectItem value="ORG 3">
                              ORGANIZATION 3
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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
