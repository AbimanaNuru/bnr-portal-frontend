"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/src/core/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  description?: string;
  className?: string;
  showHome?: boolean;
}

/**
 * A modern, reusable Breadcrumb component that supports custom icons, 
 * links, and theme-aware styling.
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  description,
  className,
  showHome = true 
}) => {
  return (
    <div className={cn("flex flex-col gap-2 pb-5 border-b border-border/60 mb-6", className)}>
      <nav 
        aria-label="Breadcrumb" 
        className="flex items-center text-sm"
      >
        <ol className="flex items-center flex-wrap">
          {showHome && (
            <li className="flex items-center">
              <Link
                href="/dashboard"
                className="text-text-secondary hover:text-text-primary transition-colors duration-200 flex items-center gap-1.5"
              >
                <Home className="h-4 w-4" />
              </Link>
              {items.length > 0 && (
                <span className="mx-3 text-text-secondary/20 font-light text-lg select-none">/</span>
              )}
            </li>
          )}

          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.label} className="flex items-center">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-text-secondary hover:text-text-primary transition-colors duration-200 flex items-center gap-1.5"
                  >
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className={cn(
                    "flex items-center gap-1.5",
                    isLast ? "text-text-primary font-semibold" : "text-text-secondary"
                  )}>
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </span>
                )}

                {!isLast && (
                  <span className="mx-3 text-text-secondary/20 font-light text-lg select-none">/</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      {description && (
        <p className="text-[13px] text-text-secondary opacity-80">
          {description}
        </p>
      )}
    </div>
  );
};

export default Breadcrumb;
