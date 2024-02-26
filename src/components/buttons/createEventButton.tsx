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
import { verifyCode } from "@/lib/validators/verifyCode";
import { api } from "@/trpc/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export type EduEmailInput = z.infer<typeof eduEmail>;
export type CodeInput = z.infer<typeof verifyCode>;

const EventButton: React.FC<{ userData: any }> = ({ userData }) => {
    const [codeSent, setCodeSent] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);

    const router = useRouter();

    const verificationCode = api.mailgun.getVerificationCode.useQuery({ id: userData.id });

    const emailForm = useForm<EduEmailInput>({
        resolver: zodResolver(eduEmail),
    });

    const { mutate: sendEmail } = api.mailgun.sendEmail.useMutation({
        onSuccess: () => {
            console.log('Email sent successfully');
            setCodeSent(true);
          },
          onError: (e) => {
            console.error('Failed to send email', e);
          },
    });

    const { mutate: insertVerificationCode } = api.mailgun.insertVerificationCode.useMutation({
        onSuccess: () => {
            console.log('Verification code inserted successfully');
          },
          onError: (e) => {
            console.error('Failed to insert verification code', e);
          },
    });

    const { mutate: deleteVerificationCode } = api.mailgun.deleteVerificationCode.useMutation({
        onSuccess: () => {
            console.log('Verification code deleted successfully');
          },
          onError: (e) => {
            console.error('Failed to delete verification code', e);
          },
    });

    const { mutate: updateVerifiedStatus } = api.mailgun.updateVerifiedStatus.useMutation({
        onSuccess: () => {
            console.log('User verified successfully');
          },
          onError: (e) => {
            console.error('Failed to verify user', e);
          },
    });

    const onEmailSubmit = async (data: { eduEmail: string; }) => {
        if (verificationCode.data) {
            deleteVerificationCode({ id: userData.id });
        }

        const verifyCode = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

        sendEmail({
            to: data.eduEmail,
            subject: 'Student Verification Code',
            text: 'Please enter the following code to verify your student email: ' + verifyCode,
        });

        insertVerificationCode({
            id: userData.id,
            code: verifyCode,
        });
      };

    const codeForm = useForm<CodeInput>({
        resolver: zodResolver(verifyCode),
    });
    
    const onCodeSubmit = async (data: { verifyCode: string; }) => {
        router.refresh();

        if (data.verifyCode === verificationCode.data?.code) {
            console.log('Code verified successfully');
            deleteVerificationCode({ id: userData.id });
            updateVerifiedStatus({ id: userData.id });
            setCodeVerified(true);
        }
        else {
            console.error('Failed to verify code');
        }
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
            {!codeVerified && (
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle> Student Verification Required</AlertDialogTitle>
                <AlertDialogDescription>
                You must be a verified student to create an event. Complete the verification process below.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <Card className="w-full max-w-2xl border border-border">
                <Form {...emailForm}>
                    <form
                        className="flex w-full flex-1 flex-col justify-center gap-6 text-muted-foreground"
                    >
                        <FormField
                            control={emailForm.control}
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
            {codeSent && (
                <div>
                    <div className="flex items-center text-sm text-gray-500 my-2">
                        A verification code has been sent to your email. Enter the 6-digit code to verify your student status.
                    </div>
                    <Form {...codeForm}>
                        <form
                            className="flex w-full flex-1 flex-col justify-center gap-6 text-muted-foreground"
                        >
                            <FormField
                                control={codeForm.control}
                                name="verifyCode"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input placeholder="Verification code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
            )}
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setCodeSent(false)}>Close</AlertDialogCancel>
                {!codeSent && (
                    <AlertDialogAction onClick={emailForm.handleSubmit(onEmailSubmit)}>Submit Email</AlertDialogAction>
                )}
                {codeSent && (
                    <AlertDialogAction onClick={codeForm.handleSubmit(onCodeSubmit)}>Verify Code</AlertDialogAction>
                )}
            </AlertDialogFooter>
            </AlertDialogContent>)}
        {codeVerified && (
            <div>
                <div className="flex items-center text-sm text-gray-500 my-2">You may close out now.</div>
                <AlertDialogContent>
                    <AlertDialogCancel onClick={() => window.location.reload()}>Close</AlertDialogCancel>
                </AlertDialogContent>
            </div>
        )}
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