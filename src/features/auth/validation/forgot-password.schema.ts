import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address (e.g., example@gmail.com)"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
