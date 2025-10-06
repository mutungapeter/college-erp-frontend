import { z } from 'zod';

export const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  modules: z.array(z.number()).min(1, 'At least one module must be selected'),
});

export type RoleFormData = z.infer<typeof roleSchema>;
