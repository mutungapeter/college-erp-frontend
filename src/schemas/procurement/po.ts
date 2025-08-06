import { z } from "zod";


const purchaseItemSchema = z.object({
  name: z.string().min(1,"Required"),
  unit: z.number().int().positive("Unit is required"),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
  unit_price: z.number().min(0, "Price must be 0 or more"), 
  category: z.number().int().positive("Required"),
  description: z.string().optional(),
});


export const makeOrderSchema = z.object({
  vendor: z.number().int().positive("Vendor is required"),
  items: z
    .array(purchaseItemSchema)
    .min(1, "You must add at least one item to the order"),
});

export const receiveOrderSchema = z.object({
 
  remarks: z.string().optional(),
});
export type MakeOrderFormData = z.infer<typeof makeOrderSchema>;
export type ReceiveOrderFormData = z.infer<typeof receiveOrderSchema>;