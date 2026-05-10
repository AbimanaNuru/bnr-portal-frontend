"use client";

import React from "react";

interface StatusBadgeProps {
    status: string;
    config?: Record<string, { bg: string; text: string; border: string; dot: string }>;
    className?: string;
}

const defaultStatusConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    Private: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", dot: "bg-red-500" },
    Public: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
    active: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
    inactive: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", dot: "bg-gray-500" },
    pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
    credit_sale: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
    cash_sale: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", dot: "bg-sky-500" },
    proforma: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, config, className = "" }) => {
    const statusConfig = config || defaultStatusConfig;
    const info = statusConfig[status] || statusConfig[status.toLowerCase()] || {
        bg: "bg-gray-50",
        text: "text-gray-600",
        border: "border-gray-200",
        dot: "bg-gray-500",
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${info.bg} ${info.text} ${info.border} ${className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${info.dot}`}></span>
            {status}
        </span>
    );
};

export default StatusBadge;
