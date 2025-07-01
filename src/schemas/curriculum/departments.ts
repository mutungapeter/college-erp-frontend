import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(1, "Campus name is required").max(50, "Name must be at most 50 characters"),
  school: z.number().nullable().optional(),
  office: z.string().nullable().optional(),
  department_type: z.string().min(1, "Department type is required").max(50, "Department type  must be at most 50 characters"),
});
export const updateDepartmentSchema = departmentSchema.partial();

export  type createDepartmentFormData = z.infer<typeof departmentSchema>;
export  type updateDepartmentFormData = z.infer<typeof updateDepartmentSchema>;



