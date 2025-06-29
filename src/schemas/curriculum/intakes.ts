
import { z } from "zod";


export const CreateIntakeSchema = z.object({
  name: z.string().min(1, "Intake name is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  closed: z.boolean().default(false),
}).refine(
  (data) => {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    return endDate >= startDate && endDate;
  },
  {
    message: "End date must be after start date and not in the past",
    path: ["end_date"] 
  }
);

export const UpdateIntakeSchema = z.object({
  name: z.string().min(1, "Intake name is required"),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  closed: z.boolean().optional(),
}).refine(
  (data) => {
    if (!data.end_date || !data.start_date) return true;

    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    const today = new Date();

   
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return endDate >= startDate && endDate;
  },
  {
    message: "End date must be after start date and not in the past",
    path: ["end_date"]
  }
);

export type  CreateIntakeFormData = z.infer<typeof CreateIntakeSchema>;
export type UpdateIntakeFormData = z.infer<typeof UpdateIntakeSchema>;