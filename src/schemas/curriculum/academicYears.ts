import { z } from 'zod';

export const academicYearSchema = z
  .object({
    name: z.string().min(1, 'Name required'),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        return endDate >= startDate;
      }
      return true;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['end_date'],
    },
  );

export type AcademicYearFormDataType = z.infer<typeof academicYearSchema>;
