
import { z } from "zod";

export const paySlipSchema = z.object({
 start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
}).refine(
  (data) => {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    return endDate >= startDate;
  },
  {
    message: "End date must be after start date and not in the past",
    path: ["end_date"] 
  }
);

export type PaySlipSchemaType = z.infer<typeof paySlipSchema>;