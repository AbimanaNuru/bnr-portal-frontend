"use client";

import { cn } from "@/src/core/lib/utils";
import Breadcrumb from "@/src/design-system/components/breadcrumb/Breadcrumb";
import { Button } from "@/src/design-system/components/button/Button";
import { SectionHeader } from "@/src/design-system/components/header/SectionHeader";
import InputTextField from "@/src/design-system/components/input/InputTextField";
import { HorizontalTabs } from "@/src/design-system/components/tabs/HorizontalTabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Calendar, Camera, CheckCircle2, Clock, Lock, Mail, Phone, Shield, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  useChangePassword,
  useToggle2FA,
  useUpdateProfile
} from "@/src/features/profile/hooks/use-profile.hooks";
import { useProfileStore } from "@/src/features/profile/store/profile.store";
import {
  profileSchema,
  securitySchema,
  type ProfileFormValues,
  type SecurityFormValues,
} from "@/src/features/profile/validation/profile.schema";
import { useEffect } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("basic-info");
  const { profile } = useProfileStore();

  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const toggle2FAMutation = useToggle2FA();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      fullName: profile?.user?.fullname || "",
      email: profile?.user?.email || "",
      phone: profile?.user?.phone_number || "",
    },
  });

  useEffect(() => {
    if (profile && profile.user) {
      resetProfile({
        fullName: profile.user.fullname || "",
        email: profile.user.email,
        phone: profile.user.phone_number || "",
      });
    }
  }, [profile, resetProfile]);

  const {
    register: registerSecurity,
    handleSubmit: handleSecuritySubmit,
    formState: { errors: securityErrors },
  } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    mode: "onChange",
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    updateProfileMutation.mutate({
      fullname: data.fullName,
      email: data.email,
      phone_number: data.phone,
    });
  };

  const onSecuritySubmit = async (data: SecurityFormValues) => {
    changePasswordMutation.mutate({
      current_password: data.currentPassword,
      new_password: data.newPassword,
    }, {
      onSuccess: () => {
        // Clear security form on success
        // Note: useForm reset() can be used if we destructure it
      }
    });
  };

  const tabs = [
    { id: "basic-info", label: "Basic Information", icon: <User /> },
    { id: "security", label: "Security & Password", icon: <Lock /> },
    { id: "two-factor", label: "Two-Factor Auth", icon: <Shield /> },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-4">
        <Breadcrumb
          items={[
            { label: "Profile Settings" }
          ]}
          description="Manage your account details and preferences."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: User Details & Navigation Tabs */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col items-center p-8 text-center relative">
            <div className="h-24 w-full bg-primary/10 absolute top-0 left-0"></div>

            <div className="relative group mt-6 mb-4">
              <div className="w-28 h-28 rounded-full bg-border overflow-hidden ring-4 ring-bg-card relative z-10">
                <img
                  src={profile?.user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.user?.fullname || "User"}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-white cursor-pointer z-20">
                <Camera className="w-6 h-6" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-text-primary">
              {profile?.user?.fullname}
            </h2>
            <p className="text-primary font-semibold text-sm mt-1 bg-primary/10 px-3 py-1 rounded-full">
              {profile?.global?.roles?.[0] || "Member"}
            </p>

            <div className="w-full h-px bg-border/50 my-6"></div>

            <div className="w-full space-y-4 text-left">
              <div className="flex items-center gap-3 text-text-secondary">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-80">Email</span>
                  <span className="text-sm font-bold text-text-primary truncate max-w-[180px]">{profile?.user?.email || "N/A"}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-80">Phone</span>
                  <span className="text-sm font-bold text-text-primary">{profile?.user?.phone_number || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Account Status Badges */}
            <div className="w-full grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border/80">
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest block opacity-80">Status</span>
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider",
                  profile?.user?.is_active
                    ? "bg-primary text-white border border-primary/30"
                    : "bg-error text-white border border-error/30"
                )}>
                  <div className={cn("w-2 h-2 rounded-full", profile?.user?.is_active ? "bg-white shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" : "bg-error")} />
                  {profile?.user?.is_active ? "Active" : "Inactive"}
                </div>
              </div>

              <div className="space-y-2 text-left">
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest block opacity-80">Verified</span>
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider",
                  profile?.user?.email_verified
                    ? "bg-primary text-white border border-primary/30"
                    : "bg-error text-white border border-error/30"
                )}>
                  {profile?.user?.email_verified ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                  )}
                  {profile?.user?.email_verified ? "Verified" : "Pending"}
                </div>
              </div>
            </div>

            {/* System Timestamps */}
            <div className="w-full space-y-5 mt-6 pt-6 border-t border-border/80 text-left">
              <div className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-bg-app border border-border/50 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <Calendar className="w-4.5 h-4.5 text-text-secondary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest leading-none opacity-80">Member Since</p>
                  <p className="text-sm font-bold text-text-primary mt-2">
                    {profile?.user?.created_at ? new Date(profile.user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-bg-app border border-border/50 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <Clock className="w-4.5 h-4.5 text-text-secondary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest leading-none opacity-80">Last Activity</p>
                  <p className="text-sm font-bold text-text-primary mt-2">
                    {profile?.user?.last_login_at
                      ? new Date(profile.user.last_login_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                      : "First Session"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-bg-app border border-border/50 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <Clock className="w-4.5 h-4.5 text-text-secondary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest leading-none opacity-80">Profile Updated</p>
                  <p className="text-sm font-bold text-text-primary mt-2">
                    {profile?.user?.updated_at
                      ? new Date(profile.user.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tab Content */}
        <div className="lg:col-span-2 space-y-4">
          <HorizontalTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === "basic-info" && (
            <div className="bg-bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
              <SectionHeader title="Basic Information" icon={<User />} />
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputTextField
                    label="Full Name"
                    placeholder="John Doe"
                    name="fullName"
                    register={registerProfile}
                    error={profileErrors.fullName?.message}
                    icon={<User />}
                  />

                  <InputTextField
                    label="Email Address"
                    placeholder="john@example.com"
                    type="email"
                    name="email"
                    register={registerProfile}
                    error={profileErrors.email?.message}
                    icon={<Mail />}
                  />

                  <div className="md:col-span-2">
                    <InputTextField
                      label="Phone Number"
                      placeholder="+1 234 567 890"
                      name="phone"
                      register={registerProfile}
                      error={profileErrors.phone?.message}
                      icon={<Phone />}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    size="lg"
                    isLoading={updateProfileMutation.isPending}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8">
                <SectionHeader title="Security" icon={<Lock />} />
                <form onSubmit={handleSecuritySubmit(onSecuritySubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <InputTextField
                      label="Current Password"
                      placeholder="••••••••"
                      type="password"
                      name="currentPassword"
                      register={registerSecurity}
                      error={securityErrors.currentPassword?.message}
                      icon={<Lock />}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputTextField
                        label="New Password"
                        placeholder="••••••••"
                        type="password"
                        name="newPassword"
                        register={registerSecurity}
                        error={securityErrors.newPassword?.message}
                        icon={<Lock />}
                      />

                      <InputTextField
                        label="Confirm New Password"
                        placeholder="••••••••"
                        type="password"
                        name="confirmPassword"
                        register={registerSecurity}
                        error={securityErrors.confirmPassword?.message}
                        icon={<Lock />}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto"
                      isLoading={changePasswordMutation.isPending}
                    >
                      Update Password
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "two-factor" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8">
                <SectionHeader title="Two-Factor Authentication" icon={<Shield />} className="mb-2" />

                <div className="space-y-4 mb-8">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <h4 className="font-bold text-text-primary text-[14px] flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Why is 2FA important?
                    </h4>
                    <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                      Two-factor authentication (2FA) adds an extra layer of security to your account.
                      Even if someone obtains your password, they won't be able to log in without the second factor.
                      This significantly reduces the risk of account takeovers and protects your sensitive data.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <p className="text-amber-600 text-sm font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Note: Email verification only
                    </p>
                    <p className="text-text-secondary text-[13px] mt-1">
                      Currently, we only support 2FA via email. When enabled, a unique verification code will be sent to your registered email address during login.
                    </p>
                  </div>
                </div>

                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-border rounded-xl bg-bg-app/50 transition-opacity ${toggle2FAMutation.isPending ? 'opacity-60 pointer-events-none' : ''}`}>
                  <div>
                    <h4 className="font-bold text-text-primary text-[14px]">Email Authentication</h4>
                    <p className="text-text-secondary text-[12px] mt-1 max-w-sm">
                      Secure your account by requiring an OTP sent to {profile?.user?.email}.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {toggle2FAMutation.isPending && (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    )}
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={profile?.user?.is_two_factor_auth || false}
                        onChange={(e) => toggle2FAMutation.mutate({ enable: e.target.checked })}
                        disabled={toggle2FAMutation.isPending}
                      />
                      <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
