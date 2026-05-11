"use client";

import { cn } from "@/src/core/lib/utils";
import { useLayoutStore } from "@/src/core/store/useLayoutStore";
import {
  ChevronLeft,
  ClipboardList,
  FileText,
  GitBranch,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  User,
  Users2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/src/features/auth/hooks/use-auth.hooks";


import { PERMISSIONS, usePermissions } from "@/src/features/access-control";

type MenuItem = {
  name: string;
  href?: string;
  onClick?: () => void;
  icon: any;
  badge?: number;
  permission?: string;
};



type MenuGroup = {
  label: string;
  items: MenuItem[];
};







export const Sidebar = () => {
  const pathname = usePathname();
  const { closeSidebar } = useLayoutStore();
  const { hasPermission } = usePermissions();
  const logout = useLogout();

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
        { name: "Applications", href: "/dashboard/applications", icon: FileText, permission: PERMISSIONS.APPLICATIONS_READ_ALL },
        { name: "My Applications", href: "/dashboard/my-applications", icon: ClipboardList, permission: PERMISSIONS.APPLICATIONS_READ_OWN },
      ],
    },
    {
      label: "COMPLIANCE",
      items: [
        { name: "Audit Trail", href: "/dashboard/audit-logs", icon: ShieldCheck, permission: PERMISSIONS.AUDIT_READ },
      ],
    },
    {
      label: "TEAM & ACCESS",
      items: [
        { name: "Access Control", href: "/dashboard/access-control", icon: Users2, permission: PERMISSIONS.ROLES_MANAGE },
      ],
    },
    {
      label: "SETTINGS",
      items: [
        { name: "Profile", href: "/dashboard/profile", icon: User },
        { name: "Workflows", href: "/dashboard/workflows", icon: GitBranch, permission: PERMISSIONS.WORKFLOW_READ },
        { name: "Document Configuration", href: "/dashboard/document-configuration", icon: FileText, permission: PERMISSIONS.DOCUMENTS_MANAGE_TYPES },
        { name: "Logout", onClick: () => logout(), icon: LogOut },
      ],
    },
  ];


  const filterItems = (items: MenuItem[]) => {
    return items.filter(item => !item.permission || hasPermission(item.permission));
  };


  const renderItem = (item: MenuItem) => {
    const isActive = item.href ? (
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href)
    ) : false;

    const content = (
      <>
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
      </>
    );

    const className = cn(
      "w-full flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all duration-150 group",
      isActive
        ? "bg-white/20 font-bold text-white shadow-sm"
        : "text-white/70 hover:text-white hover:bg-white/10 font-medium"
    );

    if (item.href) {
      return (
        <Link
          key={item.name}
          href={item.href}
          onClick={closeSidebar}
          className={className}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={item.name}
        onClick={() => {
          closeSidebar();
          item.onClick?.();
        }}
        className={className}
      >
        {content}
      </button>
    );
  };


  return (
    <aside className="w-[280px] h-full flex flex-col bg-primary shadow-xl rounded-lg lg:shadow-none border-r lg:border-r-0 border-primary/50">
      {/* Logo Area */}
      <div className="flex items-center justify-between h-[70px] sm:h-[88px] px-6 bg-white rounded-t-lg mb-4 border-b border-border/50">
        <div className="flex items-center gap-3 py-2">
          {/* BNR logo */}
          <Image
            src="https://e-recruitment.bnr.rw/static/media/new_big_logo.7f159af4c1ebda18a7ffda2f2d952359.svg"
            alt="National Bank of Rwanda"
            width={300}
            height={100}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>
        <button
          onClick={closeSidebar}
          className="lg:hidden w-8 h-8 rounded-lg border border-primary/20 flex items-center justify-center text-primary/70 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>




      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent px-4 pb-6 flex flex-col gap-6">

        {/* Grouped Menu */}
        {menuGroups.map((group) => {
          const visibleItems = filterItems(group.items);
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label} className="flex flex-col gap-1">
              <p className="text-[10px] font-bold tracking-widest text-white/40 px-3 mb-1">
                {group.label}
              </p>
              <nav className="flex flex-col gap-1">
                {visibleItems.map((item) => renderItem(item))}
              </nav>
            </div>
          );
        })}
      </div>


    </aside>
  );
};
