"use client";

import { cn } from "@/src/core/lib/utils";
import { useModalStore } from "@/src/core/store/useModalStore";
import { Button } from "@/src/design-system/components/button/Button";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * The Global Modal Container.
 * Features: 
 * - Glassmorphism Header
 * - Unsaved Changes Protection (Confirmation Dialog)
 * - Custom Sizes
 * - Escape Key & Backdrop Click handling
 */
export const GlobalModal = () => {
  const { isOpen, view, title, size, isDirty, closeModal } = useModalStore();
  const [showConfirm, setShowConfirm] = useState(false);

  // Handle closing with a dirty check
  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      closeModal();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Only trigger escape if no confirmation dialog is showing
        if (!showConfirm) handleCloseAttempt();
        else setShowConfirm(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
      setShowConfirm(false); // Reset confirmation state when fully closed
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isDirty, closeModal, showConfirm]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-full",
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[4px]"
              onClick={handleCloseAttempt}
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "relative w-full h-full bg-bg-card border-l border-border shadow-2xl flex flex-col z-[101]",
                sizeClasses[size]
              )}
            >
              {/* Header - Glassmorphism */}
              <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-bg-card/40 backdrop-blur-xl sticky top-0 z-10 transition-all">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                    {title}
                  </h2>
                  {isDirty && (
                    <motion.span
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] font-bold text-error uppercase tracking-widest flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                      Unsaved Changes
                    </motion.span>
                  )}
                </div>
                <button
                  onClick={handleCloseAttempt}
                  className="p-2.5 rounded-xl hover:bg-bg-hover transition-all text-text-secondary active:scale-90 group"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-grow p-8 overflow-y-scroll">
                <div className="min-h-full">
                  {view}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Unsaved Changes Confirmation Dialog */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-bg-card border border-border shadow-2xl rounded-3xl p-8 overflow-hidden text-center"
            >
              <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
                <AlertCircle className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-text-primary mb-2">Discard Changes?</h3>
              <p className="text-text-secondary text-sm mb-8 leading-relaxed">
                You have unsaved progress in this form. Closing now will permanently discard your changes.
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowConfirm(false)}
                >
                  Continue Editing
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setShowConfirm(false);
                    closeModal();
                  }}
                >
                  Discard & Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalModal;
