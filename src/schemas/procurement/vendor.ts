import { z } from "zod";

export const payVendorBaseSchema = z.object({
  tender_award: z.number().int().positive("Tender award is required"),
  payment_method: z.string().min(1, "Payment method is required"),
  amount: z.coerce.number().gt(0, "Amount must be greater than 0"),
   description: z.string().optional(),
});


export type PayVendorFormData = z.infer<typeof payVendorBaseSchema>;