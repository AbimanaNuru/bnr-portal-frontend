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
          {/* BNR Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-white px-6 py-4 rounded-2xl shadow-2xl shadow-black/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Image
                src="https://e-recruitment.bnr.rw/static/media/new_big_logo.7f159af4c1ebda18a7ffda2f2d952359.svg"
                alt="National Bank of Rwanda"
                width={200}
                height={60}
                className="h-14 w-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Headline — centred vertically */}
          <div>

            <h2 className="text-5xl font-extrabold tracking-tight leading-tight mb-5">
              Bank Licensing<br />&amp; Compliance<br />Portal
            </h2>
            <p className="text-white/65 text-base leading-relaxed max-w-sm">
              The official portal for submitting, tracking, and managing banking licence applications — replacing manual processes with a transparent, auditable workflow.
            </p>
          </div>

          {/* Stat pills */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest">Regulatory oversight at a glance</p>
            <div className="flex items-stretch gap-3 flex-wrap">
              {[
                { label: "Applications processed", value: "500+" },
                { label: "Avg. review cycle", value: "14 days" },
                { label: "Licensed institutions", value: "48" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col flex-1 min-w-[100px] rounded-2xl border border-white/15 px-4 py-3">
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://e-recruitment.bnr.rw/static/media/new_big_logo.7f159af4c1ebda18a7ffda2f2d952359.svg"
              alt="National Bank of Rwanda"
              className="h-12 w-auto object-contain"
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
