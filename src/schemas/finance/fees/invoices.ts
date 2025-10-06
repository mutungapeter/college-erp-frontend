import { z } from 'zod';

export const singleInvoiceSchema = z.object({
  registration_number: z.string().min(1, 'Admission number is required'),
  semester: z.coerce
    .number({
      required_error: 'semester is required',
      invalid_type_error: 'Please select a valid semester',
    })
    .int()
    .positive('semester is required'),
  invoice_type: z.coerce
    .number({
      required_error: 'Invoice Type is required',
      invalid_type_error: 'Please select a valid invoice type',
    })
    .int()
    .positive('Invoice Type is required'),
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Please enter a valid amount',
    })
    .min(1, 'Amount is required'),
});

export const invoiceTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  is_fee_type: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export const BulkInvoiceSchema = z.object({
  invoice_type: z.coerce
    .number({
      required_error: 'Invoice Type is required',
      invalid_type_error: 'Please select a valid invoice type',
    })
    .int()
    .positive('Invoice Type is required'),
  semester: z.coerce
    .number({
      required_error: 'semester is required',
      invalid_type_error: 'Please select semester',
    })
    .int()
    .positive('semester  is required'),
  cohort: z.coerce
    .number({
      required_error: 'Class  is required',
      invalid_type_error: 'Please select a Class to Invoice',
    })
    .int()
    .positive('Class is required'),
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Please enter a valid amount',
    })
    .min(1, 'Amount is required'),
});

export type InvoiceFormData = z.infer<typeof singleInvoiceSchema>;
export type BulkInvoiceFormData = z.infer<typeof BulkInvoiceSchema>;
export type InvoiceTypeFormData = z.infer<typeof invoiceTypeSchema>;
