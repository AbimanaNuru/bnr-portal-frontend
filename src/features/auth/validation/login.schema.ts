import { z } from "zod";

/* src/features/auth/validation/login.schema.ts */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .trim()                  // Removes leading/trailing spaces
    .toLowerCase()           // Standardizes to lowercase
    .email("Please enter a valid email address (e.g., example@gmail.com)"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),

  rememberMe: z.boolean(),
});


export type LoginFormValues = z.infer<typeof loginSchema>;
