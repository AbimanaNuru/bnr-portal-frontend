import { client } from "@/src/core/api/client";
import { 
  SignInRequest, 
  AuthResponse, 
  VerifyOTPRequest, 
  SignInResponseWithoutOtp, 
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RegisterRequest,
  RegisterResponse
} from "../types/auth.type";
import { GenericDetailResponse } from "@/src/core/types/detail.type";

export const login = async (data: SignInRequest): Promise<AuthResponse> => {
  const response = await client.post("/auth/login", data);
  if (response.data.otpRequired) {
    return {
      type: "OTP_REQUIRED",
      email: response.data.email,
      detail: response.data.detail
    };
  }
  return {
    ...response.data,
    type: "AUTHENTICATED"
  };
};

export const verifyOtp = async (data: VerifyOTPRequest): Promise<SignInResponseWithoutOtp> => {
  const response = await client.post("/auth/verify-otp", data);
  return response.data;
};




export const resendOtp = async (data: { email: string }): Promise<{ detail: string }> => {
  const response = await client.post("/auth/resend-otp", data);
  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<GenericDetailResponse> => {
  const response = await client.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<GenericDetailResponse> => {
  const response = await client.post("/auth/reset-password", data);
  return response.data;
};
export type ResetPasswordResponse = GenericDetailResponse;

export const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await client.post("/auth/register", data);
  return response.data;
};
