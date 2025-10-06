import { z } from 'zod';





export const payFeesBaseSchema = z.object({
  semester: z.coerce.number({
    required_error: "Semester  is required", 
    invalid_type_error: "Please select a Semester to Maka Payment",
  }).int().positive("Semester is required"),
  payment_method: z.string().min(1, "Payment method is required"),
  registration_number: z.string().min(1, "Reg number is required"),
  amount: z.coerce.number().gt(0, "Amount must be greater than 0"),
  notes: z.string().optional(),
  reference: z.string().optional(),
});

export const feeStructureItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.coerce
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be greater than zero'),
});

export const feeStructureSchema = z.object({
  programme: z.number().int().positive('Programme is required'),
  semester: z.number().int().positive('Semester is required'),
  year_of_study: z.number().int().positive('Year of study is required'),
});

export type FeeStructureFormData = z.infer<typeof feeStructureSchema>;
export type FeeStructureItemFormData = z.infer<typeof feeStructureItemSchema>;
export type PayFeesType = z.infer<typeof payFeesBaseSchema>;
export type FeesPaymentType = z.infer<typeof payFeesBaseSchema>;
export type FeesPaymentFormData = z.infer<typeof payFeesBaseSchema>;



export const bulkFeeInvoiceSchema = z
  .object({
    cohort: z.coerce.number().int().positive("Cohort is required"),
    semester: z.coerce.number().int().positive("semester is required"),
    invoice_type: z.coerce.number().int().positive("Invoice Type is required"),
  });
export const singleFeeInvoiceSchema = z
  .object({
    registration_number: z.string().min(1).max(100).nonempty("Admission number is required"),
    semester: z.coerce.number().int().positive("semester is required"),
    // invoice_type: z.coerce.number().int().positive("Invoice Type is required"),
  });


export type SingleFeeInvoiceFormData = z.infer<typeof singleFeeInvoiceSchema>;
export type BulkFeeInvoiceFormData = z.infer<typeof bulkFeeInvoiceSchema>;