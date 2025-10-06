import { z } from 'zod';

export const UpdateUserInfoSchema = z.object({
  first_name: z
    .string()
    .max(150, 'First name cannot exceed 150 characters')
    .optional(),

  last_name: z
    .string()
    .max(150, 'Last name cannot exceed 150 characters')
    .optional(),

  email: z
    .string()
    .email('Invalid email address')
    .max(254, 'Email cannot exceed 254 characters')
    .optional(),
  gender: z.string().optional(),

  phone_number: z
    .string()
    .min(1, 'Phone number is required')
    .max(10, 'Phone number cannot exceed 10 characters')
    .optional(),

  id_number: z.string().nullable().optional(),
  passport_number: z.string().nullable().optional(),

  address: z.string().nullable().optional(),

  postal_code: z.string().nullable().optional(),

  city: z.string().nullable().optional(),

  country: z
    .string()
    .min(1, 'Country is required')
    .max(255, 'Country cannot exceed 255 characters')
    .nullable()
    .optional(),

  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .nullable()
    .optional(),
});
