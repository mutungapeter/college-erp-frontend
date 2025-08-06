import { z } from "zod";



export const accountTypeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    normal_balance: z.string().min(1, "Normal Balance is required"),
 
});



export const NormalBalanceOptions: { value: string; label: string }[] = [
  { value: "debit", label: "Debit" },
  { value: "credit", label: "Credit" },
 
]


export type AccountTypeFormData = z.infer<typeof accountTypeSchema>;


