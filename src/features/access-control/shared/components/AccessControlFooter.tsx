"use client";

import React from "react";

interface AccessControlFooterProps {
  title: string;
  description: string;
}

/**
 * A reusable footer component for Access Control modals and views.
 * Provides a standardized way to display security notices or management info.
 */
export const AccessControlFooter: React.FC<AccessControlFooterProps> = ({ title, description }) => {
  return (
    <div className="pt-6 border-t border-border flex flex-col items-center gap-2 mt-auto">
      <p className="text-[15px] text-text-primary font-bold uppercase tracking-widest opacity-60">
        {title}
      </p>
      <p className="text-[13px] text-text-primary font-medium italic text-center max-w-md leading-relaxed">
        {description}
      </p>
    </div>
  );
};
