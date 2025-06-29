import { z } from "zod";



export const payLibraryFeeSchema = z.object({
  payment_method: z.string().min(1, "Payment method is required"),
  amount: z.coerce.number().gt(0, "Amount must be greater than 0"),
});

export type PayLibraryFineType = z.infer<typeof payLibraryFeeSchema>;


