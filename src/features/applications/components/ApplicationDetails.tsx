"use client";

import StatusBadge from "@/src/design-system/components/badge/StatusBadge";
import { Button } from "@/src/design-system/components/button";
import { format } from "date-fns";
import {
  ArrowRightLeft,
  Building2,
  Calendar,
  CheckCircle,
  ChevronLeft,
  DollarSign,
  History,
  Info,
  Loader2,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { DocumentManager } from "../../documents/components/DocumentManager";
import { useApplication } from "../hooks/useApplications";
import { ApplicationStatus } from "../types/application.types";
import { WorkflowTransitionControl } from "./WorkflowTransitionControl";
import { LoadingState } from "@/src/shared/components/feedback/LoadingState";
import { ErrorState } from "@/src/shared/components/feedback/ErrorState";
import { EmptyState } from "@/src/shared/components/feedback/EmptyState";

interface ApplicationDetailsProps {
  id: string;
}

const statusConfig = {
  DRAFT: { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", dot: "bg-gray-400" },
  SUBMITTED: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  UNDER_REVIEW: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  INFORMATION_REQUESTED: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  REVIEWED: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" },
  APPROVED: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  REJECTED: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
};

export const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ id }) => {
  const router = useRouter();
  const { data: application, isLoading, isError, error, refetch } = useApplication(id);

  // Keep the browser tab title in sync with the application name
  useEffect(() => {
    if (application?.title) {
      document.title = `${application.title} — BNR Portal`;
    }
    return () => {
      document.title = "BNR Portal";
    };
  }, [application?.title]);

  if (isLoading) {
    return <LoadingState message="Fetching application details…" />;
  }

  if (isError) {
    const isNotFound = (error as any)?.response?.status === 404;

    if (isNotFound) {
      return (
        <EmptyState
          title="Application Not Found"
          message="The application you are looking for does not exist or you do not have permission to view it."
          icon={<Building2 className="w-8 h-8 text-text-muted" />}
          actionLabel="Back to Applications"
          onAction={() => router.push("/dashboard/applications")}
        />
      );
    }

    return (
      <ErrorState
        title="Error Loading Application"
        message="We encountered a problem while retrieving the application details. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  if (!application) {
    return (
      <EmptyState
        title="No Data Available"
        message="We couldn't retrieve the details for this application."
        actionLabel="Back to Applications"
        onAction={() => router.push("/dashboard/applications")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Hero Header ── */}
      <div className="relative rounded-2xl overflow-hidden border border-border bg-bg-card shadow-sm">
        {/* Gradient banner */}
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

        <div className="px-6 pb-6 -mt-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Icon + Title */}
            <div className="flex items-end gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg ring-4 ring-bg-card">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-text-primary">{application.title}</h1>
                  <StatusBadge status={application.status} config={statusConfig} />
                </div>
                <p className="text-sm text-text-secondary mt-0.5">
                  {application.institution_name} &middot; {application.institution_type.replace(/_/g, " ")}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pb-1">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              {application.status === ApplicationStatus.DRAFT && (
                <Button
                  size="sm"
                  onClick={() => router.push(`/dashboard/applications/${id}/edit`)}
                >
                  <Pencil className="w-4 h-4 mr-1.5" />
                  Edit Application
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Information Requested Alert */}
          {application.status === ApplicationStatus.INFORMATION_REQUESTED && application.reviewer_notes && (
            <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Info className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-purple-900 font-bold text-sm mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Additional Information Requested
              </h3>
              <div className="bg-white/60 rounded-xl p-4 border border-purple-100">
                <p className="text-purple-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {application.reviewer_notes}
                </p>
              </div>
              <p className="text-[11px] text-purple-600 mt-3 italic">
                Please update the application or upload the required documents as requested above, then click "Resubmit" in the actions panel.
              </p>
            </div>
          )}

          {/* Institution Details */}
          <SectionCard title="Institution Details" icon={<Building2 className="w-4 h-4" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <DetailItem label="Institution Name" value={application.institution_name} />
              <DetailItem label="Institution Type" value={application.institution_type.replace(/_/g, " ")} />
              <DetailItem label="Registration Number" value={application.registration_number} />
              <DetailItem
                label="Proposed Capital"
                value={application.proposed_capital}
                icon={<DollarSign className="w-3.5 h-3.5 text-primary" />}
              />
              <div className="sm:col-span-2">
                <DetailItem
                  label="Primary Products / Services"
                  value={application.primary_products}
                  icon={<Package className="w-3.5 h-3.5 text-primary" />}
                />
              </div>
              <div className="sm:col-span-2">
                <DetailItem
                  label="Target Districts"
                  value={application.target_districts}
                  icon={<MapPin className="w-3.5 h-3.5 text-primary" />}
                />
              </div>
            </div>
          </SectionCard>

          {/* Description & Notes */}
          <SectionCard title="Description & Notes" icon={<History className="w-4 h-4" />}>
            <div className="space-y-5">
              <div>
                <p className="text-[11px] font-black text-text-secondary uppercase tracking-widest mb-2">
                  Description
                </p>
                <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
                  {application.description}
                </p>
              </div>
              {application.additional_notes && (
                <>
                  <div className="h-px bg-border" />
                  <div>
                    <p className="text-[11px] font-black text-text-secondary uppercase tracking-widest mb-2">
                      Additional Notes
                    </p>
                    <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
                      {application.additional_notes}
                    </p>
                  </div>
                </>
              )}
            </div>
          </SectionCard>

          {/* Documents */}
          <SectionCard title="Required Documents" icon={<CheckCircle className="w-4 h-4" />} noPadding>
            <div className="p-6">
              <DocumentManager applicationId={application.id} />
            </div>
          </SectionCard>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-6">
          {/* Contact Person */}
          <SectionCard title="Contact Person" icon={<User className="w-4 h-4" />}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">{application.contact_full_name}</p>
                  <p className="text-xs text-text-secondary">{application.contact_title}</p>
                </div>
              </div>
              <div className="space-y-2.5 pt-1">
                <ContactRow icon={<Mail className="w-4 h-4" />} value={application.contact_email} />
                <ContactRow icon={<Phone className="w-4 h-4" />} value={application.contact_phone} />
              </div>
            </div>
          </SectionCard>

          {/* Timeline */}
          <SectionCard title="Timeline" icon={<History className="w-4 h-4" />}>
            <div className="relative space-y-0">
              <TimelineItem
                icon={<Calendar className="w-3.5 h-3.5" />}
                label="Created"
                date={application.created_at}
                isFirst
              />
              {application.submitted_at && (
                <TimelineItem
                  icon={<ArrowRightLeft className="w-3.5 h-3.5" />}
                  label="Submitted"
                  date={application.submitted_at}
                />
              )}
              {application.declaration_accepted_at && (
                <TimelineItem
                  icon={<CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                  label="Declaration Signed"
                  date={application.declaration_accepted_at}
                  isLast
                />
              )}
            </div>
          </SectionCard>

          {/* Workflow Actions */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-sm">
            <h3 className="font-bold text-primary text-sm mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Workflow Actions
            </h3>
            <p className="text-xs text-text-secondary mb-4">
              Actions available based on the current status of this application.
            </p>
            <WorkflowTransitionControl application={application} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Sub-components ─────────────────────────────────────────────────────────── */

const SectionCard = ({
  title,
  icon,
  children,
  noPadding,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
}) => (
  <div className="rounded-2xl border border-border bg-bg-card shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-border bg-bg-app/60 flex items-center gap-2">
      <span className="text-primary">{icon}</span>
      <h3 className="font-bold text-text-primary text-sm">{title}</h3>
    </div>
    {!noPadding ? <div className="p-6">{children}</div> : children}
  </div>
);

const DetailItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) => (
  <div>
    <p className="text-[11px] font-black text-text-secondary uppercase tracking-widest mb-1 flex items-center gap-1.5">
      {icon}
      {label}
    </p>
    <p className="font-semibold text-text-primary text-sm">{value}</p>
  </div>
);

const ContactRow = ({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) => (
  <div className="flex items-center gap-2.5 text-sm text-text-secondary">
    <span className="text-text-muted shrink-0">{icon}</span>
    <span className="truncate">{value}</span>
  </div>
);

const TimelineItem = ({
  icon,
  label,
  date,
  isFirst,
  isLast,
}: {
  icon: React.ReactNode;
  label: string;
  date: string;
  isFirst?: boolean;
  isLast?: boolean;
}) => (
  <div className="flex gap-3 relative pb-4 last:pb-0">
    {/* Vertical line */}
    {!isLast && (
      <div className="absolute left-[15px] top-7 bottom-0 w-px bg-border" />
    )}
    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 z-10 text-primary">
      {icon}
    </div>
    <div className="pt-1">
      <p className="text-sm font-semibold text-text-primary">{label}</p>
      <p className="text-xs text-text-secondary mt-0.5">
        {format(new Date(date), "MMM dd, yyyy · HH:mm")}
      </p>
    </div>
  </div>
);
