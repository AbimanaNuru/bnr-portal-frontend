"use client";

import React from "react";
import { AlertCircle, LogIn } from "lucide-react";
import { Button } from "@/src/design-system/components/button/Button";
import { useModalStore } from "@/src/core/store/useModalStore";

export const SessionExpiredModal: React.FC = () => {
  const { closeModal } = useModalStore();

  const handleLoginRedirect = () => {
    closeModal();
    window.location.href = "/auth/login";
  };

  return (
    <div className="flex flex-col items-center text-center p-6 space-y-6">
      <div className="w-16 h-16 rounded-full bg-text-error/10 flex items-center justify-center animate-pulse">
        <AlertCircle className="w-8 h-8 text-text-error" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-text-primary">Session Expired</h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Your security token has expired. For your protection, please log in again to continue managing your properties.
        </p>
      </div>

      <div className="w-full pt-4">
        <Button 
          fullWidth 
          onClick={handleLoginRedirect}
          className="bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Log In Again
        </Button>
      </div>
    </div>
  );
};
