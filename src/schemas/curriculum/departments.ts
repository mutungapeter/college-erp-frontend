import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(1, "Campus name is required").max(50, "Name must be at most 50 characters"),
  school: z.number().int().positive("School  is required"),
  office: z.string().nullable().optional(),
});
export const updateDepartmentSchema = z.object({
  name: z.string().min(1, "Campus name is required").max(50, "Name must be at most 50 characters"),
  school: z.coerce.number().nullable().optional(),
  office: z.string().nullable().optional(),
});



