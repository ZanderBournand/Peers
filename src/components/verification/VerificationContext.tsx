"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
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
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { eduEmail } from "@/lib/validators/eduEmail";
import { verifyCode } from "@/lib/validators/verifyCode";
import { api } from "@/trpc/react";
export type EduEmailInput = z.infer<typeof eduEmail>;
export type CodeInput = z.infer<typeof verifyCode>;

interface VerificationState {
  isAlertOpen: boolean;
  openAlert: () => void;
  closeAlert: () => void;
}

export const VerificationContext = createContext<VerificationState | undefined>(undefined);

export const useVerificationAlert = () => {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}

export const VerificationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const openAlert = () => setIsAlertOpen(true);
  const closeAlert = () => setIsAlertOpen(false);

  const emailForm = useForm<EduEmailInput>({
      resolver: zodResolver(eduEmail),
  });

  const { mutate: sendEmail } = api.verifyStudent.sendEmail.useMutation({
      onSuccess: () => {
          console.log('Email sent successfully');
          setCodeSent(true);
        },
        onError: (e) => {
          console.error('Failed to send email', e);
        },
  });

  const { mutate: insertVerificationCode } = api.verifyStudent.insertVerificationCode.useMutation({
      onSuccess: () => {
          console.log('Verification code inserted successfully');
        },
        onError: (e) => {
          console.error('Failed to insert verification code', e);
        },
  });

  const { mutate: deleteVerificationCode } = api.verifyStudent.deleteVerificationCode.useMutation({
      onSuccess: () => {
          console.log('Verification code deleted successfully');
        },
        onError: (e) => {
          console.error('Failed to delete verification code', e);
        },
  });

  const { mutate: isVerificationCodeCorrect } = api.verifyStudent.isVerificationCodeCorrect.useMutation({
      onSuccess: (result) => {
          if (result) {
              deleteVerificationCode();
              setCodeVerified(true);
          }
        },
        onError: (e) => {
          console.error('Failed to verify code', e);
        },
  });

  const onEmailSubmit = async (data: { eduEmail: string; }) => {
      const verifyCode = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

      sendEmail({
          to: data.eduEmail,
          subject: 'Student Verification Code',
          text: 'Please enter the following code to verify your student email: ' + verifyCode,
      });

      insertVerificationCode({
          code: verifyCode,
      });
    };

  const codeForm = useForm<CodeInput>({
      resolver: zodResolver(verifyCode),
  });
  
  const onCodeSubmit = async (data: { verifyCode: string; }) => {
      isVerificationCodeCorrect({ code: data.verifyCode });
  };

  return (
    <VerificationContext.Provider value={{ isAlertOpen, openAlert, closeAlert }}>
      {children}
      <AlertDialog open={isAlertOpen}>
          {!codeVerified && (
          <AlertDialogContent>
          <AlertDialogHeader>
              <AlertDialogTitle> Student Verification Required</AlertDialogTitle>
              <AlertDialogDescription>
              You must be a verified student to perform this action. Complete the verification process below.
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
              <AlertDialogCancel onClick={ () => { setCodeSent(false); closeAlert() } }>Close</AlertDialogCancel>
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
                <AlertDialogContent>
                    <div className="flex items-center text-sm text-gray-500 my-2">You have been verified!</div>
                    <AlertDialogCancel onClick={() => window.location.reload()}>Close</AlertDialogCancel>
                </AlertDialogContent>
            </div>
        )}
        </AlertDialog>
    </VerificationContext.Provider>
  );
};
