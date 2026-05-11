"use client";

import React, { useState } from "react";
import {

  useTransitionApplication,
  useSubmissionCheck,
  useSubmitApplication,
} from "../hooks/useApplications";
import { Button } from "@/src/design-system/components/button";
import { PermissionGuard } from "@/src/features/access-control/components/PermissionGuard";
import { PERMISSIONS } from "@/src/features/access-control/permissions";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useProfile } from "../../profile/hooks/use-profile.hooks";
import { Loader2, Send, CheckCircle, XCircle, Info, AlertCircle, Play, ClipboardCheck, Pencil } from "lucide-react";
import { ApplicationStatus, Application } from "../types/application.types";

interface WorkflowTransitionControlProps {
  application: Application;
  onSuccess?: () => void;
}

export const WorkflowTransitionControl: React.FC<WorkflowTransitionControlProps> = ({
  application,
  onSuccess,
}) => {
  const router = useRouter();
  const { profile } = useProfile();
  const { mutateAsync: transition, isPending: isTransitioning } = useTransitionApplication();
  const { mutateAsync: submitApp, isPending: isSubmitting } = useSubmitApplication();
  
  const { data: checkData, isLoading: isChecking } = useSubmissionCheck(application.id);

  const isPending = isTransitioning || isSubmitting;

  const [showNotes, setShowNotes] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<{ notes: string }>();

  const handleTransition = async (data: { notes: string }) => {
    if (!selectedAction) return;
    try {
      if (selectedAction === "submit") {
        await submitApp({ id: application.id, notes: data.notes });
      } else {
        await transition({
          id: application.id,
          data: {
            action: selectedAction,
            notes: data.notes,
            version: application.version,
          },
        });
      }
      toast.success(`Action "${selectedAction}" applied successfully.`);
      setShowNotes(false);
      setSelectedAction(null);
      reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.detail?.message || error.response?.data?.detail || "Action failed");
    }
  };

  const initiateAction = (action: string) => {
    setSelectedAction(action);
    setShowNotes(true);
  };

  /** Determine which action buttons are visible based on the backend's computed available_actions. */
  const renderActions = () => {
    if (!application.available_actions || application.available_actions.length === 0) {
      if (application.status === ApplicationStatus.APPROVED) {
        return <p className="text-sm text-emerald-600 font-medium text-center">Application has been approved.</p>;
      }
      if (application.status === ApplicationStatus.REJECTED) {
        return <p className="text-sm text-red-600 font-medium text-center">Application has been rejected.</p>;
      }
      return (
        <p className="text-sm text-text-secondary text-center italic">
          No actions available for you at this stage.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-2">
        {application.available_actions.includes("submit") && (
          <div className="space-y-3">
            {isChecking ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : checkData?.ready_to_submit ? (
              <Button className="w-full gap-2" onClick={() => initiateAction("submit")}>
                <Send className="w-4 h-4" />
                Submit Application
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                  <p className="font-semibold text-red-800 mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    Not ready to submit
                  </p>
                  <ul className="space-y-1 text-red-700 list-disc list-inside text-xs">
                    {!checkData?.checks?.declaration_accepted && <li>Declaration not accepted</li>}
                    {checkData?.missing_required_documents?.map((doc: string) => (
                      <li key={doc}>Missing document: {doc}</li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full gap-2 opacity-50 cursor-not-allowed" onClick={(e) => e.preventDefault()}>
                  <Send className="w-4 h-4" />
                  Submit Application
                </Button>
              </div>
            )}
          </div>
        )}

        {application.available_actions.includes("resubmit") && (
          <Button className="w-full gap-2" onClick={() => initiateAction("resubmit")}>
            <Send className="w-4 h-4" />
            Resubmit Application
          </Button>
        )}

        {application.available_actions.includes("start_review") && (
          <Button className="w-full gap-2" onClick={() => initiateAction("start_review")}>
            <Play className="w-4 h-4" />
            Start Review
          </Button>
        )}

        {application.available_actions.includes("complete_review") && (
          <Button
            className="w-full gap-2 bg-primary hover:bg-primary-dark"
            onClick={() => initiateAction("complete_review")}
          >
            <ClipboardCheck className="w-4 h-4" />
            Complete Review
          </Button>
        )}

        {application.available_actions.includes("request_info") && (
          <Button
            variant="outline"
            className="w-full gap-2 border-amber-200 text-amber-700 hover:bg-amber-50"
            onClick={() => initiateAction("request_info")}
          >
            <Info className="w-4 h-4" />
            Request Information
          </Button>
        )}

        {(application.status === ApplicationStatus.REVIEWED || application.available_actions.includes("approve")) && (
          <Button
            className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => initiateAction("approve")}
            disabled={!application.available_actions.includes("approve") || isPending}
          >
            <CheckCircle className="w-4 h-4" />
            {application.approvals?.some(a => a.approved_by?.id === profile?.user?.id) 
              ? "Already Approved" 
              : "Approve (Final Decision)"}
          </Button>
        )}

        {application.available_actions.includes("reject") && (
          <Button
            variant="outline"
            className="w-full gap-2 border-red-200 text-red-700 hover:bg-red-50"
            onClick={() => initiateAction("reject")}
          >
            <XCircle className="w-4 h-4" />
            Reject
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {!showNotes ? (
        renderActions()
      ) : (
        <form
          onSubmit={handleSubmit(handleTransition)}
          className="space-y-3 p-4 bg-bg-app rounded-xl border border-border"
        >
          <div className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            Action: <span className="text-primary">{selectedAction}</span>
          </div>
          <textarea
            {...register("notes")}
            rows={3}
            className="w-full rounded-xl border border-border p-3 text-sm bg-bg-card text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-primary transition-all"
            placeholder="Add notes for this transition (optional)…"
          />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setShowNotes(false);
                setSelectedAction(null);
                reset();
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
