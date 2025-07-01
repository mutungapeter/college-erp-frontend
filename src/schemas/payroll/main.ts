
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

export const overtimeRecordSchema = z.object({
  staff: z.number().int().positive("Staff is required"),
  date: z.string().min(1, "Date is required"),
  hours: z.coerce.number()
    .min(0.01, "Hours must be greater than 0")
    .max(999.99, "Hours value too large"),
  rate_per_hour: z.coerce.number()
    .min(0.01, "Rate must be greater than 0")
    .max(100000000, "Rate value too high"),
  approved: z.boolean().optional(),
});

export const updateOvertimeRecordsSchema = overtimeRecordSchema.partial();

export type OvertimeRecordsFormData = z.infer<typeof overtimeRecordSchema>;
export type UpdateOvertimeRecordsFormData = z.infer<typeof updateOvertimeRecordsSchema>;
export type PaySlipSchemaType = z.infer<typeof paySlipSchema>;