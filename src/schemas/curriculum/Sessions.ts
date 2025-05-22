import { z } from "zod";

export const sessionsSchema = z.object({
  course: z.number().int().positive("Course is required"),
  cohort: z.number().int().positive("Cohort Semester is required"),
  status: z.string().min(1, "Status is required"),
  start_time: z.string().min(1, "Start time is required"),
  period: z.number().positive("Period is required").default(2),
});
export const updateSessionsSchema = z.object({
  cohort: z.number().int().positive().nullable().optional(),
  course: z.coerce.number().nullable().optional(),
  status: z.string().nullable().optional(),
  start_time: z.string().nullable().optional(),
  period: z.number().nullable().optional(),
});
