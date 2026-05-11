import React from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/src/design-system/components/button";
import { cn } from "@/src/core/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "We encountered an error while loading this data. Please try again.",
  onRetry,
  onAction,
  actionLabel,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 border border-red-100 shadow-sm">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-xs mx-auto mb-8">
        {message}
      </p>
      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="gap-2 border-red-200 text-red-700 hover:bg-red-50"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </Button>
      )}

      {onAction && actionLabel && (
        <Button 
          variant="ghost" 
          onClick={onAction}
          className={cn("text-text-secondary hover:text-text-primary", onRetry && "mt-2")}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
