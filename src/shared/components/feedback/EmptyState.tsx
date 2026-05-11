import React from "react";
import { Inbox, Plus } from "lucide-react";
import { Button } from "@/src/design-system/components/button";
import { cn } from "@/src/core/lib/utils";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No results found",
  message = "There is nothing to display here at the moment.",
  icon,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 px-4 text-center", className)}>
      <div className="w-16 h-16 rounded-2xl bg-bg-app border border-border flex items-center justify-center mb-6 shadow-sm">
        {icon || <Inbox className="w-8 h-8 text-text-muted" />}
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-xs mx-auto mb-8">
        {message}
      </p>
      {onAction && actionLabel && (
        <Button onClick={onAction} className="gap-2">
          <Plus className="w-4 h-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
