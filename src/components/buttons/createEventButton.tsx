"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { z } from "zod";
import { eduEmail } from "@/lib/validators/eduEmail";
import { verifyCode } from "@/lib/validators/verifyCode";
import { useVerificationAlert } from "../verification/VerificationContext";

export type EduEmailInput = z.infer<typeof eduEmail>;
export type CodeInput = z.infer<typeof verifyCode>;

const EventButton: React.FC<{ userData: any }> = ({ userData }) => {
    const { openAlert } = useVerificationAlert();

    return !userData.isVerifiedStudent ? (
        <Button className="my-8" variant="outline" onClick={openAlert}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Event
        </Button>
    ) : (
        <Link href="/event/new">
            <Button className="my-8" variant="outline">
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Event
            </Button>
        </Link>
    )
}

export default EventButton;