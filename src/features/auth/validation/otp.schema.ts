import { z } from "zod";

export const otpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export type OtpFormValues = z.infer<typeof otpSchema>;
