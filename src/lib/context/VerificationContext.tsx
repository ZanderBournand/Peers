"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import { set, type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { eduEmailSchema } from "@/lib/validators/eduEmail";
import { verifyCodeSchema } from "@/lib/validators/verifyCode";
import { api } from "@/trpc/react";
import uniDomains from "universities_and_domains.json";
import { useRouter } from "next/navigation";

export type CodeInput = z.infer<typeof verifyCodeSchema>;

interface VerificationState {
  openAlert: () => void;
}

export const VerificationContext = createContext<VerificationState | undefined>(
  undefined,
);

export const useVerificationAlert = () => {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error(
      "useVerification must be used within a VerificationProvider",
    );
  }
  return context;
};

export const VerificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  const [verifyButtonClicked, setVerifyButtonClicked] = useState(false);

  const [openCombo, setOpenCombo] = useState(false);
  const [university, setUniversity] = useState("");

  const [domains, setDomains] = useState([""]);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const openAlert = () => setIsAlertOpen(true);
  const closeAlert = () => setIsAlertOpen(false);

  const schema = eduEmailSchema(domains);
  type EmailInput = z.infer<typeof schema>;
  const emailForm = useForm<EmailInput>({
    resolver: zodResolver(eduEmailSchema(domains)),
  });

  const { mutate: sendEmail } = api.verifyStudent.sendEmail.useMutation({
    onSuccess: () => {
      console.log("Email sent successfully");
      setCodeSent(true);
    },
    onError: (e) => {
      console.error("Failed to send email", e);
    },
  });

  const { mutate: isVerificationCodeCorrect } =
    api.verifyStudent.isVerificationCodeCorrect.useMutation({
      onSuccess: (result) => {
        if (result) {
          setCodeVerified(true);
        }
      },
      onError: (e) => {
        console.error("Failed to verify code", e);
      },
    });

  const onEmailSubmit = async (data: { eduEmail: string }) => {
    const verifyCode = String(Math.floor(Math.random() * 1000000)).padStart(
      6,
      "0",
    );

    sendEmail({
      code: verifyCode,
      to: data.eduEmail,
      subject: "Student Verification Code",
      text:
        "Please enter the following code to verify your student email: " +
        verifyCode,
    });
  };

  const codeForm = useForm<CodeInput>({
    resolver: zodResolver(verifyCodeSchema),
  });

  const onCodeSubmit = async (data: { verifyCode: string }) => {
    setVerifyButtonClicked(true);

    isVerificationCodeCorrect({ code: data.verifyCode });
  };

  return (
    <VerificationContext.Provider value={{ openAlert }}>
      {children}
      <AlertDialog open={isAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Student Verification Required</AlertDialogTitle>
            <AlertDialogDescription>
              You must be a verified student to perform this action. Complete
              the verification process below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Popover open={openCombo} onOpenChange={setOpenCombo}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCombo}
                className="w-[400px] justify-between"
              >
                {university
                  ? uniDomains.find(
                      (uni) =>
                        uni.name.toLocaleLowerCase() ===
                        university.toLowerCase(),
                    )?.name
                  : "Select your university"}
                <ChevronsUpDown className="mr-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-h-[200px] w-[400px] overflow-auto p-0">
              <Command>
                <CommandInput placeholder="Search university..." />
                <CommandEmpty>No university found.</CommandEmpty>
                <CommandGroup>
                  {uniDomains.map((uni) => (
                    <CommandItem
                      key={uni.name}
                      value={uni.name}
                      onSelect={(currentUniversity) => {
                        setUniversity(
                          currentUniversity === university
                            ? ""
                            : currentUniversity,
                        );
                        setOpenCombo(false);
                        setDomains(uni.domains);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          university === uni.name ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {uni.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {domains[0] != "" && (
            <Card className="w-full max-w-2xl border border-border">
              <Form {...emailForm}>
                <form className="flex w-full flex-1 flex-col justify-center gap-6 text-muted-foreground">
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

          )}
          {codeSent && (
            <div>
              <div className="my-2 flex items-center text-sm text-gray-500">
                A verification code has been sent to your email. Enter the
                6-digit code to verify your student status.
              </div>
              <Form {...codeForm}>
                <form className="flex w-full flex-1 flex-col justify-center gap-6 text-muted-foreground">
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
              {!codeVerified && verifyButtonClicked && (
                <div className="my-2 text-sm text-red-500">
                  <div>
                    The code you entered is invalid. Please try again.
                  </div>
                  <button className="underline" onClick={emailForm.handleSubmit(onEmailSubmit)}>
                    Need to resend the code? Click here.
                  </button>
                </div>
              )}
              {codeVerified && (
                <div className="my-2 flex items-center text-sm text-green-500">
                  You have been verified! You may close out now.
                </div>
              )}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setCodeSent(false);
                setUniversity("");
                setDomains([""]);
                router.refresh();
                closeAlert();
              }}
            >
              Close
            </AlertDialogCancel>
            {!codeSent && (
              <AlertDialogAction
                onClick={emailForm.handleSubmit(onEmailSubmit)}
              >
                Submit Email
              </AlertDialogAction>
            )}
            {codeSent && !codeVerified && (
              <AlertDialogAction onClick={codeForm.handleSubmit(onCodeSubmit)}>
                Verify Code
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </VerificationContext.Provider>
  );
};
