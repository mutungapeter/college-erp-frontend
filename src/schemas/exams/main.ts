import { z } from 'zod';

// const examDataBaseSchema = {
//   student: z.number().int().positive().nullable().optional(),
//   semester: z.number().int().positive().nullable().optional(),
//   cohort: z.number().int().positive().nullable().optional(),
//   course: z.number().int().positive().nullable().optional(),
//   cat_one: z.coerce.number().default(0).nullable().optional(),
//   cat_two: z.coerce.number().default(0).nullable().optional(),
//   exam_marks: z.coerce.number().default(0).nullable().optional(),
//   total_marks: z.number().default(0).nullable().optional(),
//   recorded_by: z.number().int().positive().nullable().optional(),
// };

export const examDataCreateSchema = z.object({
  cat_one: z.coerce.number().default(0),
  cat_two: z.coerce.number().default(0),
  exam_marks: z.coerce.number().default(0),
    study_year: z.number().int().positive('Study Year is required'),
});

export const uploadMarksSchema = z.object({
  course: z.number().int().positive('Cohort is required'),
  study_year: z.number().int().positive('Study Year is required'),
  semester: z.number().int().positive('Campus is required'),
  cohort: z.number().int().positive('Cohort is required'),
  file: z
    .instanceof(File)
    .refine((file) => {
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      return validTypes.includes(file.type);
    }, 'Please upload a CSV or Excel file')
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      'File size should be less than 10MB',
    ),
});

export const updateStudentsCohortSchema = z.object({
  cohort: z.coerce.number().nullable().optional(),
});
export const updateExamDataSchema = examDataCreateSchema.partial();

export type ExamDataCreate = z.infer<typeof examDataCreateSchema>;
export type ExamDataUpdate = z.infer<typeof updateExamDataSchema>;
