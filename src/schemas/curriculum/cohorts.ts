import { z } from "zod";

export const cohortSchema = z.object({
  name: z.string().min(1, "Cohort name is required").max(50, "Cohort Name must be at most 50 characters"),
  programme: z.number().int().positive("Programme is required"),
  current_semester: z.number().int().positive("Current Semester is required"),
  status: z.string().min(1, "Status is required"),
  current_year: z.string().min(1, "Current year is required"),
 
});
export const updateCohortSchema = z.object({
  name: z.string().min(1, "Cohort name is required").max(50, "Cohort Name must be at most 50 characters"),
  status: z.string().nullable().optional(),
  current_year: z.string().nullable().optional(),
  current_semester: z.coerce.number().nullable().optional(),
  programme: z.coerce.number().nullable().optional(),
});

