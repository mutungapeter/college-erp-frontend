import { z } from "zod";


export const categorySchema = z.object({
  category_type: z.string().min(1,"Required"),
  name: z.string().min(1,"Required"),
  description: z.string().optional(),
});

export const unitofMeasureSchema = z.object({
  name: z.string().min(1,"Required"),
});




export type CategoryFormData = z.infer<typeof categorySchema>;
export type UnitOfMeasureFormData = z.infer<typeof unitofMeasureSchema>;