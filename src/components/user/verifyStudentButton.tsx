"use client";

import { Button } from "@/components/ui/button";
import { useVerificationAlert } from "../../lib/context/VerificationContext";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
const VerifyStudentButton: React.FC<object> = () => {
  const verificationAlert = useVerificationAlert();

  return (
    <Button
      variant="outline"
      onClick={verificationAlert?.openAlert}
      className="bg-green-200/20"
    >
      <CheckBadgeIcon className="mr-2 h-6 w-6" color="green"/>
      Verify Your Student Status!
    </Button>
  );
};

export default VerifyStudentButton;
