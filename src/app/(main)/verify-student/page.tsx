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
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { eduEmail } from "@/lib/validators/eduEmail";

export type EduEmailInput = z.infer<typeof eduEmail>;

export default function VerifyStudent() {
    const form = useForm<EduEmailInput>({
        resolver: zodResolver(eduEmail),
    });

    const onSubmit = async () => {
        // mutate({
        //   firstName: capitalizeFirstLetter(data.firstName),
        //   lastName: capitalizeFirstLetter(data.lastName),
        //   skills: skillsList,
        //   bio: data.bio,
        //   github: data.github,
        //   linkedin: data.linkedin,
        //   website: data.website,
        // });
      };

    return (
        <div className="flex w-screen justify-center p-8">
            <Card className="w-full max-w-2xl border border-border">
                <CardHeader className="flex flex-col justify-center items-center p-8">
                    <CardTitle>Verify Student Status</CardTitle>
                    <CardDescription>Please enter your student email below</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex w-full flex-1 flex-col justify-center gap-6 text-muted-foreground"
                        >
                            <FormField
                                control={form.control}
                                name="eduEmail"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="">Student Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your student email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                Verify
                            </Button>
                        </form>
                    </Form>
                </CardContent>    
            </Card>
        </div>
    );
}