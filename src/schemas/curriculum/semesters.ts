import { z } from 'zod';

export const semesterSchema = z
  .object({
    academic_year: z.number().int().positive('Academic Year is required'),
    name: z.string().min(1, 'Semester name is required'),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    status: z.string().min(1, 'Status is required'),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      // const currentDate = new Date();
      return endDate >= startDate && endDate;
    },
    {
      message: 'End date must be after start date and not in the past',
      path: ['end_date'],
    },
  );

export const updateSemesterSchema = z
  .object({
    academic_year: z.number().int().positive('Academic Year is required'),
    name: z.string().min(1, 'Semester name is required'),
    start_date: z.string().nullable().optional(),
    end_date: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (!data.end_date || !data.start_date) return true;

      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      const today = new Date();

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      return endDate >= startDate && endDate;
    },
    {
      message: 'End date must be after start date and not in the past',
      path: ['end_date'],
    },
  );

export type CreateSemesterFormData = z.infer<typeof semesterSchema>;
