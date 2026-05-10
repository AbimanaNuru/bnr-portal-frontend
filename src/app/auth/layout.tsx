import { ThemeSwitcher } from "@/src/design-system/theme";
import Image from "next/image";
import React from "react";
import { AuthPanelDecor } from "./AuthPanelDecor";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-app-bg text-text-primary">
      {/* Left side: Decorative section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        {/* Advanced animated background decoration */}
        <AuthPanelDecor />

        <div className="relative z-10 flex flex-col justify-between text-white px-12 py-16 h-full w-full max-w-xl mx-auto">
          {/* Logo */}
          <div className="relative w-44 h-14">
            <Image
              src="/MVO-white.png"
              alt="Mavo Services Logo"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain object-left"
            />
          </div>

          {/* Headline — centred vertically */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-4">
              Property Management Platform
            </p>
            <h2 className="text-5xl font-extrabold tracking-tight leading-tight mb-5">
              Simplify Your<br />Property<br />Management
            </h2>
            <p className="text-white/65 text-base leading-relaxed max-w-sm">
              Manage properties, tenants, and finances — all from one powerful, easy-to-use platform built for modern landlords.
            </p>
          </div>

          {/* Stat pills */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest">Trusted by property managers</p>
            <div className="flex items-stretch gap-3 flex-wrap">
              {[
                { label: "Properties managed", value: "10K+" },
                { label: "Occupancy rate", value: "94%" },
                { label: "Active users", value: "2K+" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col flex-1 min-w-[100px] rounded-2xl  border border-white/15 px-4 py-3">
                  <span className="text-2xl font-bold leading-none">{stat.value}</span>
                  <span className="text-xs text-white/55 mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Auth forms */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 bg-app-bg">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Image
              src="/MVO-green.png"
              alt="Mavo Services Logo"
              width={120}
              height={40}
              style={{ height: "auto" }}
              className="object-contain"
            />
          </div>
          {children}

          <div className="mt-12 flex justify-center">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
