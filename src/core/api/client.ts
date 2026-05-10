import { useModalStore } from "@/src/core/store/useModalStore";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { SessionExpiredModal } from "@/src/shared/components/layout/SessionExpiredModal";
import axios from "axios";
import React from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for Authorization header
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("bnr-auth-storage");
  if (token) {
    try {
      const parsed = JSON.parse(token);
      const accessToken = parsed.state?.accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (e) {
      console.error("Error parsing auth token from storage", e);
    }
  }
  return config;
});

// Interceptor for 401 handling
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear session
      const authStore = useAuthStore.getState();
      const modalStore = useModalStore.getState();

      authStore.logout();

      // Trigger prompt if not already open
      if (!modalStore.isOpen) {
        modalStore.openModal(
          React.createElement(SessionExpiredModal),
          "Authentication Required",
          "full"
        );
      }
    }

    return Promise.reject(error);
  }
);
