"use client";

import { useVerificationAlert } from "../../lib/context/VerificationContext";
import { useRouter } from "next/navigation";
import type { UserData } from "@/lib/interfaces/userData";
import { AiOutlinePlusCircle } from "react-icons/ai";

const CreateEventIcon: React.FC<{ userData: UserData }> = ({ userData }) => {
  const router = useRouter();

  const verificationAlert = useVerificationAlert();

  const handleClick = () => {
    console.log(userData?.isVerifiedStudent);
    if (!userData?.isVerifiedStudent) {
      verificationAlert?.openAlert();
    } else {
      router.push("/event/new");
    }
  };

  return (
    <a
      id="create-event-link"
      className="color-grey ml-1.5 mt-1.5 cursor-pointer"
      onClick={handleClick}
      title="Create Event"
    >
      <AiOutlinePlusCircle className="color-grey" />
    </a>
  );
};

export default CreateEventIcon;
