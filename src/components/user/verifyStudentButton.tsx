"use client";

import { Button } from "@/components/ui/button";
import { useVerificationAlert } from "../../lib/context/VerificationContext";

const VerifyStudentButton: React.FC<object> = () => {
  const verificationAlert = useVerificationAlert();

  return (
    <Button variant="default" onClick={verificationAlert?.openAlert}>
      Verify Your Student Status!
    </Button>
  );
};

export default VerifyStudentButton;
