"use client";

import React, { useState } from "react";
import {
  useApplicationRequirements,
  useUploadApplicationDocument,
  useDownloadDocument,
} from "../hooks/useDocuments";
import { Button } from "@/src/design-system/components/button";
import StatusBadge from "@/src/design-system/components/badge/StatusBadge";
import { PermissionGuard } from "@/src/features/access-control/components/PermissionGuard";
import { PERMISSIONS } from "@/src/features/access-control/permissions";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Download,
  Loader2,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useApplicationDocuments } from "../hooks/useDocuments";

interface DocumentManagerProps {
  applicationId: string;
}

const requiredBadgeConfig = {
  Required: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", dot: "bg-red-500" },
};

export const DocumentManager: React.FC<DocumentManagerProps> = ({ applicationId }) => {
  const { data: requirements, isLoading: reqsLoading } = useApplicationRequirements(applicationId);
  const { data: allDocuments, isLoading: docsLoading } = useApplicationDocuments(applicationId);
  const uploadMutation = useUploadApplicationDocument();
  const downloadMutation = useDownloadDocument();
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [showHistoryFor, setShowHistoryFor] = useState<number | null>(null);

  const isLoading = reqsLoading || docsLoading;

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    typeId: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingId(typeId);
    try {
      await uploadMutation.mutateAsync({ applicationId, file, documentTypeId: typeId });
      toast.success("Document uploaded successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Upload failed");
    } finally {
      setUploadingId(null);
      // Reset input value so the same file can be re-uploaded
      e.target.value = "";
    }
  };

  const handleDownload = async (documentId: number, name: string) => {
    try {
      const blob = await downloadMutation.mutateAsync({ documentId, applicationId });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        Required Documents
      </h3>

      <div className="grid gap-3">
        {requirements?.map((req) => (
          <React.Fragment key={req.id}>
            <div
              className="flex items-center justify-between p-4 bg-bg-card rounded-xl border border-border shadow-sm"
            >
            {/* Left: status icon + info */}
            <div className="flex items-start gap-3 min-w-0">
              {req.is_satisfied ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              ) : req.is_required_snapshot ? (
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              ) : (
                <FileText className="w-5 h-5 text-text-muted mt-0.5 shrink-0" />
              )}

              <div className="min-w-0">
                <div className="font-medium text-text-primary flex items-center gap-2 flex-wrap">
                  <span className="truncate">{req.name_snapshot}</span>
                  {req.is_required_snapshot && (
                    <StatusBadge status="Required" config={requiredBadgeConfig} />
                  )}
                </div>
                <div className="text-xs text-text-secondary mt-0.5">
                  {req.is_satisfied
                    ? `Uploaded ${format(new Date(req.satisfied_at!), "MMM dd, yyyy HH:mm")}`
                    : "Not yet uploaded"}
                </div>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2 shrink-0 ml-4">
              {/* Download — available to anyone who can read documents */}
              {req.is_satisfied && (
                <PermissionGuard
                  permissions={[PERMISSIONS.DOCUMENTS_READ, PERMISSIONS.DOCUMENT_READ]}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(req.latest_document_id!, req.name_snapshot)}
                    disabled={downloadMutation.isPending || !req.latest_document_id}
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Download
                  </Button>
                </PermissionGuard>
              )}

              {/* History Toggle */}
              {req.is_satisfied && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistoryFor(showHistoryFor === req.id ? null : req.id)}
                  className="px-2"
                >
                  {showHistoryFor === req.id ? <ChevronUp className="w-4 h-4" /> : <History className="w-4 h-4" />}
                </Button>
              )}

              {/* Upload — requires write-level permission */}
              <PermissionGuard
                permissions={[PERMISSIONS.DOCUMENTS_READ, PERMISSIONS.DOCUMENT_READ]}
              >
                <>
                  <input
                    type="file"
                    id={`upload-${req.id}`}
                    className="hidden"
                    onChange={(e) => handleUpload(e, req.document_type_id)}
                    disabled={uploadingId === req.document_type_id}
                  />
                  <label
                    htmlFor={`upload-${req.id}`}
                    className={`
                      inline-flex items-center gap-1.5 cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold
                      transition-all duration-200 select-none
                      ${
                        req.is_satisfied
                          ? "border border-border text-text-secondary hover:bg-bg-hover"
                          : "bg-primary text-white hover:bg-primary/90"
                      }
                      ${uploadingId === req.document_type_id ? "opacity-60 pointer-events-none" : ""}
                    `}
                  >
                    {uploadingId === req.document_type_id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        {req.is_satisfied ? "Update" : "Upload"}
                      </>
                    )}
                  </label>
                </>
              </PermissionGuard>
            </div>
          </div>

          {/* History Section */}
          {showHistoryFor === req.id && (
            <div className="mt-2 ml-8 p-3 bg-bg-app rounded-lg border border-border animate-in slide-in-from-top-1">
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Version History</div>
              <div className="space-y-2">
                {allDocuments
                  ?.filter((d) => d.document_type_id === req.document_type_id)
                  .map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between text-sm py-1 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${doc.is_latest ? 'bg-emerald-100 text-emerald-700' : 'bg-bg-hover text-text-secondary'}`}>
                          V{doc.version_number}
                        </span>
                        <span className="text-text-primary truncate max-w-[200px]">{doc.original_filename}</span>
                        <span className="text-[10px] text-text-muted">({(doc.file_size_bytes / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-text-muted">{format(new Date(doc.uploaded_at), "MMM dd, HH:mm")}</span>
                        <button 
                          onClick={() => handleDownload(doc.id, doc.original_filename)}
                          className="text-primary hover:text-primary-hover p-1"
                          title="Download this version"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          </React.Fragment>
        ))}
        {requirements?.length === 0 && (
          <div className="text-center py-8 text-text-secondary bg-bg-app rounded-xl border border-dashed border-border">
            No document requirements defined for this application.
          </div>
        )}
      </div>
    </div>
  );
};
