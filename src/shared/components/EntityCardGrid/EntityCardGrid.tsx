"use client";

import { ChevronRight, Info } from "lucide-react";
import React from "react";
import { LucideIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EntityCardTag {
  label: string;
  variant?: "success" | "warning" | "info" | "error" | "muted" | "primary";
  tooltip?: string;
}

export interface EntityCardAction {
  label?: string;
  icon: LucideIcon;
  onClick: (e: React.MouseEvent) => void;
  variant?: "primary" | "secondary" | "success" | "error" | "muted";
}

export interface EntityCardItem {
  id: string | number;
  name: string;
  description?: string;
  /** Custom tags/badges shown below description */
  tags?: EntityCardTag[];
  /** Number shown in the footer badge (e.g. permission count) */
  count?: number;
  /** Label above the count (e.g. "Permissions") */
  countLabel?: string;
  /** Primary icon shown top-left */
  icon: LucideIcon;
  /** Optional secondary/decorative icon shown top-right */
  secondaryIcon?: LucideIcon;
  /** Custom footer actions (buttons/badges) */
  actions?: EntityCardAction[];
}

export interface AddCardConfig {
  /** Bold label text */
  label: string;
  /** Subtle sub-label text */
  subLabel?: string;
  /** Icon displayed inside the add card */
  icon: LucideIcon;
  onClick?: () => void;
}

export interface EntityCardGridProps {
  items?: EntityCardItem[];
  isLoading?: boolean;
  /** Called when a card is clicked; receives the full item */
  onCardClick?: (item: EntityCardItem) => void;
  /** When provided, renders a dashed "add" card at the end */
  addCard?: AddCardConfig;
  /** Number of skeleton cards shown while loading (default 3) */
  skeletonCount?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const EntityCardGrid: React.FC<EntityCardGridProps> = ({
  items,
  isLoading,
  onCardClick,
  addCard,
  skeletonCount = 3,
}) => {
  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className="h-48 bg-bg-card border border-border rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* ── Item cards ──────────────────────────────────────────────────── */}
      {items?.map((item) => {
        const PrimaryIcon = item.icon;
        const SecondaryIcon = item.secondaryIcon;

        return (
          <div
            key={item.id}
            onClick={() => onCardClick?.(item)}
            className="group bg-bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer"
          >
            {/* Top row: primary icon + optional secondary icon */}
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                <PrimaryIcon className="w-6 h-6" />
              </div>
              {SecondaryIcon && (
                <div className="p-2 text-text-muted">
                  <SecondaryIcon className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Name + description + tags */}
            <div className="space-y-3 mb-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-text-secondary line-clamp-2">
                  {item.description || "No description provided."}
                </p>
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {item.tags.map((tag, idx) => (
                    <div key={idx} className="relative group/tag flex items-center">
                      <span
                        className={`
                          flex items-center gap-1.5 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border transition-all cursor-default
                          ${
                            tag.variant === "success"
                              ? "bg-text-success/5 text-text-success border-text-success/20"
                              : tag.variant === "warning"
                              ? "bg-text-warning/5 text-text-warning border-text-warning/20"
                              : tag.variant === "error"
                              ? "bg-text-error/5 text-text-error border-text-error/20"
                              : tag.variant === "info"
                              ? "bg-text-info/5 text-text-info border-text-info/20"
                              : tag.variant === "primary"
                              ? "bg-primary/5 text-primary border-primary/20"
                              : "bg-bg-hover text-text-muted border-border"
                          }
                        `}
                      >
                        {tag.label}
                        {tag.tooltip && <Info className="w-2.5 h-2.5 opacity-60 group-hover/tag:opacity-100 transition-opacity" />}
                      </span>
                      {tag.tooltip && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-text-primary/95 backdrop-blur-md text-text-inverse text-[11px] font-medium rounded-xl shadow-2xl opacity-0 pointer-events-none group-hover/tag:opacity-100 group-hover/tag:-translate-y-1 transition-all duration-300 whitespace-pre-line z-50 border border-white/10 min-w-[200px]">
                          <div className="flex items-start gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mt-1.5 shrink-0" />
                             <span className="leading-relaxed">{tag.tooltip}</span>
                          </div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-text-primary/95" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer: count label + actions */}
            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
              <div className="flex flex-col">
                {item.countLabel && (
                  <span className="text-[12px] uppercase tracking-widest font-bold text-text-primary">
                    {item.countLabel}
                  </span>
                )}
                {item.count !== undefined && (
                  <span className="text-sm font-bold text-text-primary italic">
                    {item.count} Total
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {item.actions && item.actions.length > 0 ? (
                  item.actions.map((action, idx) => {
                    const ActionIcon = action.icon;
                    return (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(e);
                        }}
                        className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all
                          ${
                            action.variant === "primary"
                              ? "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                              : action.variant === "success"
                              ? "bg-text-success/10 text-text-success hover:bg-text-success hover:text-white"
                              : action.variant === "error"
                              ? "bg-text-error/10 text-text-error hover:bg-text-error hover:text-white"
                              : "bg-bg-hover text-text-secondary hover:bg-border"
                          }
                        `}
                      >
                        <ActionIcon className="w-3.5 h-3.5" />
                        {action.label && <span>{action.label}</span>}
                      </button>
                    );
                  })
                ) : (
                  <div className="w-8 h-8 rounded-full bg-bg-hover flex items-center justify-center text-text-secondary group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Add card ────────────────────────────────────────────────────── */}
      {addCard && (
        <div
          onClick={addCard.onClick}
          className="bg-bg-card border border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-bg-hover flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-white transition-all">
            <addCard.icon className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="font-bold text-text-primary">{addCard.label}</p>
            {addCard.subLabel && (
              <p className="text-xs text-text-secondary">{addCard.subLabel}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
