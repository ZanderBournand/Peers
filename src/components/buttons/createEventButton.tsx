"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import Link from "next/link";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { eduEmail } from "@/lib/validators/eduEmail";
import { api } from "@/trpc/react";

export type EduEmailInput = z.infer<typeof eduEmail>;

const EventButton: React.FC<{ userData: any }> = ({ userData }) => {
    const form = useForm<EduEmailInput>({
        resolver: zodResolver(eduEmail),
    });

    const { mutate } = api.mailgun.sendEmail.useMutation({
        onSuccess: () => {
            console.log('Email sent successfully');
          },
          onError: (e) => {
            console.error('Failed to send email', e);
          },
    });

    const onSubmit = async (data: { eduEmail: string; }) => {
        mutate({
            to: data.eduEmail,
            subject: 'Student Verification Code',
            text: 'Please enter the following code to verify your student email: 123456',
        });
      };

    return !userData.isVerifiedStudent ? (
        <AlertDialog>
            <Button className="my-8" variant="outline">
                <AlertDialogTrigger>
                    <div className="flex items-center">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Create Event
                    </div>
                </AlertDialogTrigger>
            </Button>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle> Student Verification Required</AlertDialogTitle>
                <AlertDialogDescription>
                You must be a verified student to create an event. Complete the verification process below.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <Card className="w-full max-w-2xl border border-border">
                <Form {...form}>
                    <form
                        className="flex w-full flex-1 flex-col justify-center gap-6 text-muted-foreground"
                    >
                        <FormField
                            control={form.control}
                            name="eduEmail"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input placeholder="Your student email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </Card>
            <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
                <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>Verify</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    ) : (
        <Link href="/event/new">
          <Button className="my-8" variant="outline">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
    );
}

export default EventButton;