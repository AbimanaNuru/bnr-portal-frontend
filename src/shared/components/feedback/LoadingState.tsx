import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/src/core/lib/utils";

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading…",
  fullPage = false,
  className,
}) => {
  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-4 text-center", className)}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
        <Loader2 className="w-5 h-5 text-primary absolute inset-0 m-auto animate-pulse" />
      </div>
      <p className="text-sm font-medium text-text-secondary animate-pulse">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-app/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="py-12">{content}</div>;
};
