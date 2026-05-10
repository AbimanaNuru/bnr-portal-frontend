import { z } from "zod";
import { InstitutionType } from "../types/application.types";

export const applicationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  institution_name: z.string().min(2, "Institution name is required"),
  institution_type: z.nativeEnum(InstitutionType),
  registration_number: z.string().min(2, "Registration number is required"),
  contact_full_name: z.string().min(2, "Contact full name is required"),
  contact_title: z.string().min(2, "Contact title is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().min(8, "Invalid phone number"),
  proposed_capital: z.string().min(1, "Proposed capital is required"),
  primary_products: z.string().min(5, "Primary products/services are required"),
  target_districts: z.string().min(2, "Target districts are required"),
  declaration_accepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the declaration",
  }),
  additional_notes: z.string().optional(),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;

export const applicationUpdateSchema = applicationSchema.partial().extend({
  version: z.number(),
});
