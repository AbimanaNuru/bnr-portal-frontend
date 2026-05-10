import { create } from "zustand";
import React from "react";

interface ModalState {
  isOpen: boolean;
  title: string;
  view: React.ReactNode | null;
  size: "sm" | "md" | "lg" | "xl" | "full";
  isDirty: boolean; // Tracks if the form inside has unsaved changes
  
  /**
   * Opens the modal with a specific content and configuration.
   */
  openModal: (
    view: React.ReactNode, 
    title?: string, 
    size?: "sm" | "md" | "lg" | "xl" | "full"
  ) => void;
  
  /**
   * Sets the dirty state of the modal (e.g. when a user starts typing).
   */
  setDirty: (isDirty: boolean) => void;
  
  /**
   * Closes the modal and resets the state.
   */
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  title: "",
  view: null,
  size: "md",
  isDirty: false,
  
  openModal: (view, title = "", size = "md") => 
    set({ 
      isOpen: true, 
      view, 
      title, 
      size,
      isDirty: false // Reset dirty state on new modal
    }),
    
  setDirty: (isDirty) => set({ isDirty }),

  closeModal: () => 
    set({ 
      isOpen: false, 
      view: null, 
      title: "",
      isDirty: false
    }),
}));
