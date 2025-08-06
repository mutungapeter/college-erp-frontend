import { z } from "zod";

export const createTenderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  deadline: z.string().min(1, "Deadline is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  projected_amount: z.coerce.number().min(1, "Projected amount is required"),
  tender_document: z
    .instanceof(File)
    .refine((file) => {
      const validTypes = ["application/pdf"];
      return validTypes.includes(file.type);
    }, "Please upload a Pdf  file")
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size should be less than 10MB"
    ),
});

export const TenderApplicationSchema = z.object({
  tender: z.number().int().positive("Tender is required").optional(),

  company_name: z
    .string()
    .min(1, "Company name is required")
    .max(255, "Company name is too long"),

  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required")
    .max(254, "Email is too long"),

  phone: z.string().min(1, "Phone is required").max(20, "Phone is too long"),

  address: z.string().optional(),

  contact_person: z
    .string()
    .max(255, "Contact person is too long")
    .nullable()
    .optional(),

  contact_person_phone: z
    .string()
    .max(20, "Contact person phone is too long")
    .nullable()
    .optional(),

  contact_person_email: z
    .string()
    .email("Invalid contact person email")
    .max(254, "Contact person email is too long")
    .nullable()
    .optional(),

  business_type: z.string().nullable().optional(),

  company_registration_number: z
    .string()
    .min(1, "Company registration number is required")
    .max(100, "Company registration number is too long"),

  tax_pin: z
    .string()
    .min(1, "Tax PIN is required")
    .max(100, "Tax pin is too long"),

  vendor_no: z
    .string()
    .min(1, "Vendor number is required")
    .max(50, "Vendor number is too long")
    .nullable()
    .optional(),
});

export const ExistingVendorApplicationSchema = TenderApplicationSchema.extend({
  company_name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  company_registration_number: z.string().optional(),
  tax_pin: z.string().optional(),
  vendor_no: z
    .string()
    .min(1, "Vendor number is required")
    .max(50, "Vendor number is too long"),
});

export const NewVendorApplicationSchema = TenderApplicationSchema.extend({
  vendor_no: z.string().optional(),
});

export type tenderApplicationFormData = z.infer<typeof TenderApplicationSchema>;
export type existingVendorApplicationFormData = z.infer<
  typeof ExistingVendorApplicationSchema
>;
export type newVendorApplicationFormData = z.infer<
  typeof NewVendorApplicationSchema
>;
export type createTenderFormData = z.infer<typeof createTenderSchema>;

const tenderApplicationDocumentBaseSchema = {
  document_name: z.string().min(1, "Document name is required").max(255),
  document_type: z.string().min(1, "Document type is required"),
  description: z.string().optional(),
  file: z
    .instanceof(File)
    .refine(
      (file) => file.type === "application/pdf",
      "Please upload a PDF file"
    )
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size should be less than 10MB"
    ),
};

export const tenderApplicationDocumentCreateSchema = z.object({
  document_name: tenderApplicationDocumentBaseSchema.document_name,
  document_type: tenderApplicationDocumentBaseSchema.document_type,
  file: tenderApplicationDocumentBaseSchema.file,
  description: tenderApplicationDocumentBaseSchema.description,
});

export const tenderApplicationDocumentUpdateSchema =
  tenderApplicationDocumentCreateSchema.optional();

export type ApplicationDocumentFormData = z.infer<
  typeof tenderApplicationDocumentCreateSchema
>;
export type ApplicationDocumentUpdateFOrmData = z.infer<
  typeof tenderApplicationDocumentUpdateSchema
>;

export const BusinessTypeOptions: { value: string; label: string }[] = [
  { value: "individual", label: "Individual" },
  { value: "sole_proprietor", label: "Sole Proprietor" },
  { value: "partnership", label: "Partnership" },
  { value: "limited", label: "Limited" },
  { value: "ngo", label: "NGO" },
  { value: "government", label: "Government" },
  { value: "other", label: "Other" },
];
