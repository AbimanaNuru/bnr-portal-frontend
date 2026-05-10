import { z } from "zod";

export const documentTypeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  is_required: z.boolean(),
  is_active: z.boolean(),
});

export type DocumentTypeSchema = z.infer<typeof documentTypeSchema>;
