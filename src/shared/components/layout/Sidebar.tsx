"use client";

import { cn } from "@/src/core/lib/utils";
import { useLayoutStore } from "@/src/core/store/useLayoutStore";
import {
  Bell,
  ChevronLeft,
  ClipboardList,
  FileSearch,
  FileText,
  Landmark,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  User,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  name: string;
  href: string;
  icon: any;
  badge?: number;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
  {
    label: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "LICENSING",
    items: [
      { name: "Applications", href: "/dashboard/applications", icon: FileText },
      { name: "My Applications", href: "/dashboard/my-applications", icon: ClipboardList },
      { name: "Review Queue", href: "/dashboard/review-queue", icon: FileSearch },
    ],
  },
  {
    label: "COMPLIANCE",
    items: [
      { name: "Licensed Institutions", href: "/dashboard/institutions", icon: Landmark },
      { name: "Audit Trail", href: "/dashboard/audit-trail", icon: ShieldCheck },
    ],
  },
  {
    label: "TEAM & ACCESS",
    items: [
      { name: "Access Control", href: "/dashboard/access-control", icon: Users2 },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { name: "Profile", href: "/dashboard/profile", icon: User },
      { name: "Document Configuration", href: "/dashboard/document-configuration", icon: FileText },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

const bottomMenuItems: MenuItem[] = [
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { closeSidebar } = useLayoutStore();

  const renderItem = (item: MenuItem) => {
    const isActive =
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href);

    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={closeSidebar}
        className={cn(
          "flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all duration-150 group",
          isActive
            ? "bg-white/20 font-bold text-white shadow-sm"
            : "text-white/70 hover:text-white hover:bg-white/10 font-medium"
        )}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={cn(
              "flex items-center justify-center w-[38px] h-[38px] rounded-[12px] transition-colors",
              isActive
                ? "bg-white text-primary shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                : "bg-transparent text-white/70 group-hover:bg-white/10 group-hover:text-white"
            )}
          >
            <item.icon className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </div>
          <span className="text-[14px] text-white font-semibold">{item.name}</span>
        </div>

        {item.badge && (
          <span className="bg-white text-primary text-[13px] font-bold px-2 py-0.5 rounded-md leading-tight mr-1">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="w-[280px] h-full flex flex-col bg-primary shadow-xl rounded-lg lg:shadow-none border-r lg:border-r-0 border-primary/50">
      {/* Logo Area */}
      <div className="flex items-center justify-between h-[70px] sm:h-[88px] px-6">
        <div className="flex items-center gap-3">
          {/* BNR logo — white version via CSS invert */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://e-recruitment.bnr.rw/static/media/new_big_logo.7f159af4c1ebda18a7ffda2f2d952359.svg"
            alt="National Bank of Rwanda"
            className="h-10 w-auto object-contain brightness-0 invert"
          />
        </div>
        <button
          onClick={closeSidebar}
          className="lg:hidden w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>

      <div className="mx-6 h-[1px] bg-white/20 mb-4" />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent px-4 pb-6 flex flex-col gap-6">

        {/* Grouped Menu */}
        {menuGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <p className="text-[10px] font-bold tracking-widest text-white/40 px-3 mb-1">
              {group.label}
            </p>
            <nav className="flex flex-col gap-1">
              {group.items.map((item) => renderItem(item))}
            </nav>
          </div>
        ))}

        {/* Bottom Menu */}
        <nav className="flex flex-col mt-auto gap-1">
          {bottomMenuItems.map((item) => renderItem(item))}
        </nav>
      </div>
    </aside>
  );
};
