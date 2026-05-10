import React from "react";
import { cn } from "@/src/core/lib/utils";

export type TabItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

interface HorizontalTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const HorizontalTabs: React.FC<HorizontalTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div className={cn("inline-flex items-center p-1.5 space-x-1 bg-bg-card border border-border rounded-xl mb-2", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              isActive
                ? "bg-primary/10 text-primary font-bold shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
            )}
          >
            {tab.icon && (
              <span className={cn("flex items-center justify-center [&>svg]:w-[18px] [&>svg]:h-[18px]", isActive ? "text-primary" : "text-text-muted")}>
                {tab.icon}
              </span>
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
