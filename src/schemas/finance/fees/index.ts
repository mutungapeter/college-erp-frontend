import { z } from "zod";



export const payFeesBaseSchema = z.object({
  student: z.number().int().positive("Student is required"),
  semester: z.number().int().positive("Semester is required"),
  payment_method: z.string().min(1, "Payment method is required"),
  amount: z.coerce.number().gt(0, "Amount must be greater than 0"),
});

export const FeesPaymentSchema = payFeesBaseSchema.pick({
  payment_method: true,
  amount: true,
});


export const feeStructureItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than zero"),
});

export const feeStructureSchema = z.object({
  programme: z.number().int().positive("Programme is required"),
  semester: z.number().int().positive("Semester is required"),
  year_of_study: z.number().int().positive("Year of study is required"),
});

export type FeeStructureFormData  = z.infer<typeof feeStructureSchema>;
export type FeeStructureItemFormData = z.infer<typeof feeStructureItemSchema>;
export type PayFeesType = z.infer<typeof payFeesBaseSchema>;
export type FeesPaymentType = z.infer<typeof FeesPaymentSchema>;


