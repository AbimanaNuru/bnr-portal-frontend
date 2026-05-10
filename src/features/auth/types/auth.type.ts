export type SignInRequest = {
    email: string;
    password: string;
};

export type SignInResponseWithoutOtp = {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
    is_first_login: boolean;
    email: string;
    requires_role_selection: boolean;
    active_role: string | null;
    roles: string[];
    detail?: string;
}

export type SignInResponseWithOtp = {
    detail: string;
    email: string;
    otpRequired: boolean;
}


export type VerifyOTPRequest = {
    email: string;
    otp: string;
}


export type VerifyOTPResponse = SignInResponseWithoutOtp;




export type SwitchRoleRequest = {
    role_name: string;
}

export type SwitchRoleResponse = SignInResponseWithoutOtp;

export type AuthStatus =
  | "UNAUTHENTICATED"
  | "LOADING"
  | "OTP_REQUIRED"
  | "AUTHENTICATED";

export type AuthResponse =
  | {
      type: "OTP_REQUIRED";
      email: string;
      detail: string;
    }
  | (SignInResponseWithoutOtp & { type: "AUTHENTICATED" });

export type AuthState = {
  status: AuthStatus;
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  roles: string[];
  activeRole: string | null;
  isFirstLogin: boolean;

  setStatus: (status: AuthStatus) => void;
  setOtpRequired: (email: string) => void;
  setAuthenticated: (data: SignInResponseWithoutOtp) => void;
  logout: () => void;
};


export type ResendOtpRequest = {
    email: string;
}



export type ForgotPasswordRequest = {
    email: string;
}


export type ResetPasswordRequest = {
    token: string;
    new_password: string;
}

export type RegisterRequest = {
  full_name: string;
  email: string;
  password: string;
  institution_name: string;
};

export type RegisterResponse = {
  email: string;
  detail: string;
};
    