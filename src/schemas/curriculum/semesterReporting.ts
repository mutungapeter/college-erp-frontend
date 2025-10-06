import { z } from 'zod';

export const bulkReportingSchema = z.object({
  cohort: z.coerce.number().int().positive('Cohort is required'),
  semester: z.coerce.number().int().positive('Semester is required'),
});
export const singleReportingSchema = z.object({
  registration_number: z
    .string()
    .min(1)
    .max(100)
    .nonempty('Reg No  is required'),
  semester: z.coerce.number().int().positive('Semester is required'),
});
export type SingleReportingFormData = z.infer<typeof singleReportingSchema>;
export type BulkReportingFormData = z.infer<typeof bulkReportingSchema>;

export const bulkPromotionSchema = z.object({
  cohort: z.coerce
    .number({
      required_error: 'Cohort is required',
      invalid_type_error: 'Please select a Current cohort ',
    })
    .int()
    .positive('Current class is required'),
  study_year: z.coerce
    .number({
      required_error: 'Next Study Year is required',
      invalid_type_error: 'Please select a Next Study Year  ',
    })
    .int()
    .positive('Next Study Year   is required'),
});
export const bulkGraduationSchema = z.object({
  cohort: z.coerce
    .number({
      required_error: 'Cohort is required',
      invalid_type_error: 'Please select a Cohort ',
    })
    .int()
    .positive('Cohort is required'),
});

export const singlePromotionSchema = z.object({
  registration_number: z
    .string()
    .min(1)
    .max(100)
    .nonempty('Reg number is required'),
  study_year: z.coerce
    .number({
      required_error: 'Study Year is required',
      invalid_type_error: 'Please select a Next Study Year',
    })
    .int()
    .positive('Next class is required'),
});
export const singleGraduationSchema = z.object({
  registration_number: z
    .string()
    .min(1)
    .max(100)
    .nonempty('Registration number is required'),
});
export type SinglePromotionFormData = z.infer<typeof singlePromotionSchema>;
export type BulkPromotionFormData = z.infer<typeof bulkPromotionSchema>;
export type SingleGraduationFormData = z.infer<typeof singleGraduationSchema>;
export type BulkGraduationFormData = z.infer<typeof bulkGraduationSchema>;
