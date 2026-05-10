"use client";

import React from "react";
import { usePermissionCategories } from "../hooks/usePermissions";
import { Key, CheckCircle2, ChevronRight } from "lucide-react";

export const PermissionList: React.FC = () => {
  const { data: categories, isLoading } = usePermissionCategories();

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 w-48 bg-bg-card border border-border rounded-lg animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-24 bg-bg-card border border-border rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {categories?.map((category) => (
        <div key={category.id} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">{category.name}</h2>
              <p className="text-sm text-text-secondary">{category.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.permissions?.map((permission) => (
              <div 
                key={permission.id}
                className="bg-bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="w-4 h-4 text-text-success opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors">
                      {permission.name}
                    </p>
                    <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">
                      {permission.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {(!category.permissions || category.permissions.length === 0) && (
              <div className="col-span-full py-8 text-center bg-bg-hover/30 rounded-2xl border border-dashed border-border">
                <p className="text-sm text-text-muted">No specific permissions defined in this category yet.</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
