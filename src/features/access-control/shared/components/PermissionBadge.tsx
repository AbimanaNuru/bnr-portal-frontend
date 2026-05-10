import React from 'react';

interface PermissionBadgeProps {
  permission: string;
}

export const PermissionBadge: React.FC<PermissionBadgeProps> = ({ permission }) => {
  return (
    <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
      {permission}
    </span>
  );
};
