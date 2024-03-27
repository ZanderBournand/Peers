"use client";

import { Button } from "@/components/ui/button";
import { useVerificationAlert } from "../../lib/context/VerificationContext";
import { PiStudentFill } from "react-icons/pi";
const VerifyStudentButton: React.FC<object> = () => {
  const verificationAlert = useVerificationAlert();

  return (
    <Button
      variant="default"
      onClick={verificationAlert?.openAlert}
      style={{ backgroundColor: "red" }}
    >
      <PiStudentFill className="mr-2 h-5 w-5" />
      Verify Your Student Status!
    </Button>
  );
};

export default VerifyStudentButton;
