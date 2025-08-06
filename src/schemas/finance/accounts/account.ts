import { z } from "zod";



export const createAccountSchema = z.object({
  account_type: z.number().int().positive("Account Type is required"),
  name: z.string().min(1, "Account Name is required"),
  account_code: z.string().min(1, "Account Name is required"),
  is_default: z.boolean(),
  is_contra: z.boolean(),
  cash_flow_section:z.string().min(1, "Cash Flow Section is required"),
});

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;


export const CashFlowOptions:{value:string,label:string}[] =  [
  { value: "Operating", label: "Operating" },
  { value: "Investing", label: "Investing" },
  { value: "Financing", label: "Financing" },
];





