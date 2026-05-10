import { client } from "@/src/core/api/client";
import { 
  ProfileMeResponse, 
  UserBasicInfoUpdateRequest, 
  ChangePasswordRequest, 
  TwoFactorToggleRequest 
} from "../types/profile.type";

export const getProfileMe = async (): Promise<ProfileMeResponse> => {
  const response = await client.get("/users/me");
  return response.data;
};

export const updateProfile = async (data: UserBasicInfoUpdateRequest): Promise<{ detail: string }> => {
  const response = await client.patch("/auth/update-profile", data);
  return response.data;
};

export const changePassword = async (data: ChangePasswordRequest): Promise<{ detail: string }> => {
  const response = await client.put("/auth/change-password", data);
  return response.data;
};

export const toggle2FA = async (data: TwoFactorToggleRequest): Promise<{ detail: string }> => {
  const response = await client.post("/auth/toggle-2fa", data);
  return response.data;
};
