import { z } from 'zod';

export const programmeSchema = z.object({
  name: z
    .string()
    .min(1, 'Programme name is required')
    .max(50, 'Programme Name must be at most 50 characters'),
  code: z.string().min(1, 'Programme Code  is required'),
  school: z.number().int().positive('School is required'),
  department: z.number().int().positive('Department is required'),
  level: z.string().min(1, 'Level is required'),
});
export const updateProgrammeSchema = z.object({
  name: z
    .string()
    .min(1, 'Programme name is required')
    .max(50, 'Programme Name must be at most 50 characters'),
  code: z.string().min(1, 'Programme Code  is required'),
  school: z.coerce.number().nullable().optional(),
  department: z.coerce.number().nullable().optional(),
  level: z.string().min(1, 'Level is required'),
});
