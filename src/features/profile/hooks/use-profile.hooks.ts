import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileMe, updateProfile, changePassword, toggle2FA } from "../api/profile.api";
import { useProfileStore } from "../store/profile.store";
import { useEffect } from "react";
import { toast } from "sonner";

export function useProfile(enabled: boolean = true) {
  const { setProfile, profile } = useProfileStore();

  const query = useQuery({
    queryKey: ["profile", "me"],
    queryFn: getProfileMe,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    enabled,
  });

  useEffect(() => {
    if (query.data) {
      setProfile(query.data);
    }
  }, [query.data, setProfile]);

  return {
    ...query,
    profile: profile || query.data,
  };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      toast.success(res.detail || "Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update profile");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (res) => {
      toast.success(res.detail || "Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to change password");
    },
  });
}

export function useToggle2FA() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggle2FA,
    onSuccess: (res) => {
      toast.success(res.detail || "Two-factor authentication updated");
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update 2FA");
    },
  });
}
