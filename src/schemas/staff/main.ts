import { z } from 'zod';


const payrollBaseSchema = z.object({
  nhif_number: z.string().min(1, "Nhif is required").max(200).nullable().optional(),
  nssf_number: z.string().min(1, "Nssf is required").max(200).nullable().optional(),
  kra_pin: z.string().min(1, "Kra pin is required").max(200).nullable().optional(),
  bank_name: z.string().min(0, "bank name is required").max(200).nullable().optional(),
  bank_account_number: z.string().min(0, "This field is required").max(200).nullable().optional(),
  mpesa_number: z.string().min(0, "Field  is required").max(200).nullable().optional(),
  basic_salary: z.coerce.number().min(1, "value should be greater than 0").max(100000000).nullable().optional(),
  house_allowance: z.coerce.number().min(0, "Value be less than 0").max(5000000).nullable().optional(),
  transport_allowance: z.coerce.number().min(0,"Value cannot be less than 0").max(10000000).nullable().optional(),
  other_allowances: z.coerce.number().min(0,"Value cannot be less than 0").max(10000000).nullable().optional(),
  
});


export const singleDocumentSchema = z.object({
  document_type: z.string().nonempty("Document type is required"),
  document_file: z
    .instanceof(File)
    .refine(file => file.size > 0, "File is required")
    .nullable()
    .optional(),
  notes: z.string().optional(),
});


export const staffDocumentMultiCreateSchema = z.object({
  documents: z.array(singleDocumentSchema).min(1, "At least one document is required"),
});



export const staffBaseSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50, "First Name must be at most 50 characters"),
  last_name: z.string().min(1, "Last name is required").max(50, "Last Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  gender: z.string().min(1, "Gender is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  department: z.number().int().positive("Department is required"),
  position: z.number().int().positive("Position is required"),
  // role: z.number().int().positive("Role is required"),
  address: z.string().min(1, "Address is required"),
  

  id_number: z.string().nullable().optional(),
  passport_number: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
 
});
export const createStaffSchema = staffBaseSchema;

export const updateStaffSchema = z.object({
    position: z.coerce.number().nullable().optional(),
    department: z.coerce.number().nullable().optional(),
});


export const payrollCreateSchema = payrollBaseSchema.required()
export const payrollUpdateSchema = payrollBaseSchema.partial()
export const createPositionSchema = z.object({
  name: z.string().min(1, "name is required").max(50, "Name must be at most 50 characters"),
});


export type StaffDocumentMultiCreate = z.infer<typeof staffDocumentMultiCreateSchema>;

export type PayrollCreateType = z.infer<typeof payrollCreateSchema>;
export type PayrollUpdateType = z.infer<typeof payrollUpdateSchema>;

export type CreateStaffType = z.infer<typeof createStaffSchema>;
export type UpdateStaffType = z.infer<typeof updateStaffSchema>;

export type createPositionFormData = z.infer<typeof createPositionSchema>;