import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthState, AuthStatus, SignInResponseWithoutOtp } from "../types/auth.type";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      status: "UNAUTHENTICATED",
      email: null,
      accessToken: null,
      refreshToken: null,
      roles: [],
      activeRole: null,
      isFirstLogin: false,

      setStatus: (status: AuthStatus) => set({ status }),

      setOtpRequired: (email: string) =>
        set({
          status: "OTP_REQUIRED",
          email,
        }),

      setAuthenticated: (data: SignInResponseWithoutOtp) =>
        set({
          status: data.requires_role_selection
            ? "ROLE_SELECTION_REQUIRED"
            : "AUTHENTICATED",
          accessToken: data.access_token,
          refreshToken: data.refresh_token ?? null,
          email: data.email,
          roles: data.roles,
          activeRole: data.active_role,
          isFirstLogin: data.is_first_login,
        }),

      logout: () =>
        set({
          status: "UNAUTHENTICATED",
          accessToken: null,
          refreshToken: null,
          email: null,
          roles: [],
          activeRole: null,
          isFirstLogin: false,
        }),
    }),
    {
      name: "mavo-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        email: state.email,
        roles: state.roles,
        activeRole: state.activeRole,
        isFirstLogin: state.isFirstLogin,
        status: state.status,
      }),
    }
  )
);
