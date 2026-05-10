import ThemeSwitcher from "@/src/design-system/theme/ThemeSwitcher";
import { ChevronDown, LogOut, Menu, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useLayoutStore } from "@/src/core/store/useLayoutStore";
import { useLogout } from "@/src/features/auth/hooks/use-auth.hooks";
import { useProfileStore } from "@/src/features/profile/store/profile.store";

export const Topbar = () => {
  const pathname = usePathname();
  const { toggleSidebar } = useLayoutStore();
  const logout = useLogout();
  const { profile } = useProfileStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format pathname to a readable title
  const getPageTitle = () => {
    if (pathname === "/" || pathname === "/dashboard") return "Dashboard";

    const path = pathname.split('/').pop() || "";
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className="h-[70px] sm:h-[88px] shrink-0 flex items-center justify-between px-4 sm:px-8 bg-bg-card  rounded-lg border-b sm:border-b-0 border-border/50">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 rounded-lg text-text-secondary hover:bg-bg-hover transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Page Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary truncate max-w-[150px] sm:max-w-none">
          {getPageTitle()}
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Switcher */}
        <div className="mr-2">
          <ThemeSwitcher />
        </div>



        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-4 ml-2 border-l border-border cursor-pointer hover:bg-bg-hover/50 p-1 rounded-xl transition-all"
          >
            <div className="flex flex-col items-end overflow-hidden hidden sm:flex">
              <span className="font-bold text-[14px] text-text-primary leading-tight">
                {profile?.user?.fullname}
              </span>
              <span className="text-[12px] text-text-secondary font-medium leading-tight">
                {profile?.user?.email || "user@example.com"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-border overflow-hidden ring-2 ring-border/50 hover:ring-primary/30 transition-all relative">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.user?.email || 'User'}`}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-60 bg-bg-card border border-border rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-border/50 mb-1">
                <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest opacity-80">Account Management</p>
              </div>

              <Link href="/dashboard/profile" onClick={() => setIsProfileOpen(false)}>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <span>My Profile</span>
                </button>
              </Link>





              <div className="px-2 pt-1 pb-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold text-white bg-text-error hover:bg-text-error/80 transition-all shadow-sm shadow-error/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
