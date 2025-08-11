import { z } from "zod";


export const categorySchema = z.object({
  category_type: z.string().min(1,"Required"),
  name: z.string().min(1,"Required"),
  description: z.string().optional(),
});

export const inventoryItemSchema = z.object({
  category: z.number().int().positive("Category is required"),
  unit: z.number().int().positive("Unit is required"),
  name: z.string().min(1,"Required"),
  description: z.string().optional(),
  quantity_in_stock: z.coerce.number().min(0,"Required"),
  unit_valuation: z.coerce.number().min(0,"Required"),
  total_valuation: z.coerce.number().min(0,"Required"),
});

export const issueInventoryItemSchema = z.object({
  inventory_item: z.number().int().positive("Inventory Item is required"),
  issued_to: z.number().int().positive("Issued To is required"),
  remarks: z.string().optional(),
  quantity: z.coerce.number().min(1,"Required"),
  
});

export const unitofMeasureSchema = z.object({
  name: z.string().min(1,"Required"),
});



export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type UnitOfMeasureFormData = z.infer<typeof unitofMeasureSchema>;
export type IssueInventoryItemFormData = z.infer<typeof issueInventoryItemSchema>;