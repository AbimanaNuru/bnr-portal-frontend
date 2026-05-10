import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  forgotPassword,
  login,
  resendOtp,
  registerUser,
  resetPassword,
  verifyOtp
} from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import { AuthResponse } from "../types/auth.type";

export function useLogin() {
  const setOtpRequired = useAuthStore((s) => s.setOtpRequired);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setStatus = useAuthStore((s) => s.setStatus);
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onMutate: () => {
      setStatus("LOADING");
    },
    onSuccess: (res: AuthResponse) => {
      if (res.type === "OTP_REQUIRED") {
        toast.success("OTP required to continue");
        setOtpRequired(res.email);
        router.push("/auth/verify-otp");
      } else if (res.type === "AUTHENTICATED") {
        toast.success("Successfully logged in!");
        setAuthenticated(res);
      }
    },
    onError: (error: any) => {
      setStatus("UNAUTHENTICATED");
      const message = error.response?.data?.detail || "Login failed. Please check your credentials.";
      toast.error(message);
    }
  });
}

export function useVerifyOtp() {
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setStatus = useAuthStore((s) => s.setStatus);

  return useMutation({
    mutationFn: verifyOtp,
    onMutate: () => {
      setStatus("LOADING");
    },
    onSuccess: (res) => {
      toast.success("OTP verified successfully!");
      setAuthenticated(res);
    },
    onError: (error: any) => {
      setStatus("OTP_REQUIRED");
      const message = error.response?.data?.detail || "Invalid OTP. Please try again.";
      toast.error(message);
    }
  });
}



import { useProfileStore } from "../../profile/store/profile.store";

import { useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const clearProfile = useProfileStore((s) => s.clearProfile);
  const queryClient = useQueryClient();

  return () => {
    logout();
    clearProfile();
    queryClient.clear();
    toast.success("Successfully logged out.");
  };
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (res) => {
      toast.success(res.detail || "Password reset successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Failed to reset password.";
      toast.error(message);
    }
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (res) => {
      toast.success(res.detail || "Reset link sent to your email!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Failed to send reset link.";
      toast.error(message);
    }
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: resendOtp,
    onSuccess: (res) => {
      toast.success(res.detail || "OTP resent successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Failed to resend OTP.";
      toast.error(message);
    }
  });
}
export function useRegister() {
  const setOtpRequired = useAuthStore((s) => s.setOtpRequired);
  const router = useRouter();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (res) => {
      toast.success(res.detail || "Account created! Please verify your email.");
      setOtpRequired(res.email);
      router.push("/auth/verify-otp");
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Registration failed. Please try again.";
      toast.error(message);
    }
  });
}
