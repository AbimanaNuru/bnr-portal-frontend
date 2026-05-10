import React from "react";
import { cn } from "@/src/core/lib/utils";

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  description,
  className,
}) => {
  return (
    <div className={cn("mb-6", className)}>
      <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
        {icon && (
          <span className="[&>svg]:w-5 [&>svg]:h-5 text-primary flex items-center justify-center">
            {icon}
          </span>
        )}
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-secondary mt-1">{description}</p>
      )}
    </div>
  );
};
