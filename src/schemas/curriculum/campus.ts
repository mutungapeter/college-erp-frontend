import { z } from 'zod';

export const campusSchema = z.object({
  name: z
    .string()
    .min(1, 'Campus name is required')
    .max(50, 'Name must be at most 255 characters'),
  city: z
    .string()
    .min(1, 'City is required')
    .max(50, 'City must be at most 50 characters'),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(255, 'Address must be at most 50 characters'),
  phone_number: z.string().nullable().optional(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email')
    .nullable()
    .optional(),
  population: z.coerce.number().nullable().optional(),
});
export const updateCampusSchema = campusSchema.partial();
export type updateCampusTypeFormData = z.infer<typeof updateCampusSchema>;
export type CampusTypeFormData = z.infer<typeof campusSchema>;
