import { z } from 'zod';

export const studyYearSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});
