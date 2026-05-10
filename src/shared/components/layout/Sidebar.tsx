"use client";

import { cn } from "@/src/core/lib/utils";
import { useLayoutStore } from "@/src/core/store/useLayoutStore";
import {
  BadgeDollarSign,
  Bell,
  Briefcase,
  ChevronLeft,
  Home,
  MessageSquarePlus,
  Settings,
  Tag,
  User,

  Users,
  Users2,
} from "lucide-react";
import Image from "next/image";
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
    label: "PROPERTY MANAGEMENT",
    items: [
      { name: "Properties", href: "/dashboard/properties", icon: Home },
      { name: "Structure Types", href: "/dashboard/properties/structure-types", icon: Tag },
      { name: "Inquiries", href: "/dashboard/properties-inquiries", icon: MessageSquarePlus },

      { name: "Offers", href: "/dashboard/offers", icon: BadgeDollarSign },
    ],
  },
  {
    label: "CUSTOMERS",
    items: [
      { name: "Buyers", href: "/buyers", icon: Users },
      { name: "Tenants", href: "/tenants", icon: Users2 },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { name: "Leases", href: "/leases", icon: Briefcase },
      { name: "Payments", href: "/payments", icon: BadgeDollarSign },
    ],
  },
  {
    label: "TEAM & ACCESS",
    items: [
      { name: "Team Management", href: "/dashboard/team-management", icon: Users2 },
      { name: "Access Control", href: "/dashboard/access-control", icon: Users2 },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { name: "Subscription", href: "/dashboard/subscription", icon: Settings },
      { name: "Profile", href: "/dashboard/profile", icon: User },
    ],
  },
];

const bottomMenuItems: MenuItem[] = [
  { name: "Notifications", href: "/notifications", icon: Bell, badge: 32 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { closeSidebar } = useLayoutStore();

  const renderItem = (item: MenuItem) => {
    const isActive = pathname === item.href;

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
          <Image
            src="/MVO-white.png"
            alt="Logo"
            width={120}
            height={40}
            priority
            style={{ height: "auto" }}
            className="object-contain"
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
