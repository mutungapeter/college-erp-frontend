import { z } from "zod";

export const unitSchema = z.object({
  name: z.string().min(1, "Programme name is required").max(50, "Programme Name must be at most 50 characters"),
  course_code: z.string().min(1, "Course Code  is required"),
  school: z.number().int().positive("School is required"),
  department: z.number().int().positive("Department is required"),
  programme: z.number().int().positive("Programme is required"),

 
});
export const AddunitSchema = z.object({
  name: z.string().min(1, "Programme name is required").max(50, "Programme Name must be at most 50 characters"),
  course_code: z.string().min(1, "Course Code  is required"),
  
});
export const updateUnitDetailSchema = z.object({
  name: z.string().min(1, "Programme name is required").max(50, "Programme Name must be at most 50 characters"),
  course_code: z.string().min(1, "Course Code  is required"),
  
});

export const updateUnitSchema = z.object({
  name: z.string().min(1, "Programme name is required").max(50, "Programme Name must be at most 50 characters"),
  course_code: z.string().min(1, "Course Code  is required"),
  school: z.number().int().positive().nullable().optional(),
  department: z.number().int().positive().nullable().optional(),
  programme: z.number().int().positive().nullable().optional(),
});

